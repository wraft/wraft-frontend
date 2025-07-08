import { useEffect, useState, useCallback } from 'react';

import { useSocket } from '../contexts/SocketContext';
import { fetchAPI, postAPI } from '../utils/models';

interface Notification {
  id: string;
  message: string;
  type: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket, connected } = useSocket();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = (await fetchAPI(
        'notifications',
        '?limit=50',
      )) as NotificationResponse;
      setNotifications(response.notifications || []);
      setUnreadCount(response.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await postAPI(`notifications/${notificationId}/mark_read`, {});

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await postAPI('notifications/mark_all_read', {});

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!connected || !socket) return;

    const handleNewNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notification = customEvent.detail;

      // Add new notification to the list
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleDocumentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { document_id, user_name, action } = customEvent.detail;

      const notification: Notification = {
        id: `doc_${Date.now()}`,
        message: `${user_name} ${action} document`,
        type: 'document_update',
        data: { document_id },
        read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleApprovalRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message, document_title, document_id } = customEvent.detail;

      const notification: Notification = {
        id: `approval_${Date.now()}`,
        message: `Approval needed: ${document_title}`,
        type: 'approval_request',
        data: { document_id },
        read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleCollaborationInvite = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { inviter_name, document_title, document_id } = customEvent.detail;

      const notification: Notification = {
        id: `collab_${Date.now()}`,
        message: `${inviter_name} invited you to collaborate on ${document_title}`,
        type: 'collaboration_invite',
        data: { document_id },
        read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleWorkflowStatus = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { status, workflow_name, workflow_id } = customEvent.detail;

      const notification: Notification = {
        id: `workflow_${Date.now()}`,
        message: `Workflow ${workflow_name} is now ${status}`,
        type: 'workflow_status',
        data: { workflow_id },
        read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    // Add event listeners
    window.addEventListener('notification', handleNewNotification);
    window.addEventListener('document_update', handleDocumentUpdate);
    window.addEventListener('approval_request', handleApprovalRequest);
    window.addEventListener('collaboration_invite', handleCollaborationInvite);
    window.addEventListener('workflow_status', handleWorkflowStatus);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('notification', handleNewNotification);
      window.removeEventListener('document_update', handleDocumentUpdate);
      window.removeEventListener('approval_request', handleApprovalRequest);
      window.removeEventListener(
        'collaboration_invite',
        handleCollaborationInvite,
      );
      window.removeEventListener('workflow_status', handleWorkflowStatus);
    };
  }, [connected, socket]);

  // Fetch notifications on mount
  useEffect(() => {
    if (connected) {
      fetchNotifications();
    }
  }, [connected, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    clearNotifications,
  };
};

export default useNotifications;
