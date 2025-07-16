import { useEffect, useState, useCallback } from 'react';

import { Notification } from 'components/Notification/NotificationUtil';

import { useSocket } from '../contexts/SocketContext';
import { fetchAPI, putAPI } from '../utils/models';

interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
  page_number: number;
  total_entries: number;
  total_pages: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  paginationMeta: {
    pageNumber: number;
    totalEntries: number;
    totalPages: number;
  } | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: (page?: number) => Promise<void>;
  clearNotifications: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<{
    pageNumber: number;
    totalEntries: number;
    totalPages: number;
  } | null>(null);

  const {
    socket,
    connected,
    notificationsInitialized,
    resetNotificationsState,
  } = useSocket();

  const fetchNotifications = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const query = `sort=inserted_at_desc&page=${page}&limit=50`;
      const response = (await fetchAPI(
        'notifications',
        `?${query}`,
      )) as NotificationResponse;
      setNotifications(response.notifications || []);
      setUnreadCount(response.unread_count || 0);
      setPaginationMeta({
        pageNumber: response.page_number,
        totalEntries: response.total_entries,
        totalPages: response.total_pages,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await putAPI(`notifications/read/${notificationId}`, {});

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

  const markAllAsRead = useCallback(async () => {
    try {
      await putAPI('notifications/read_all', {});

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    resetNotificationsState();
  }, [resetNotificationsState]);

  const handleNewNotification = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const notification = customEvent.detail.body;

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleDocumentUpdate = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { document_id, user_name, action } = customEvent.detail;

    const notification: Notification = {
      id: `doc_${Date.now()}`,
      message: `${user_name} ${action} document`,
      event_type: 'document_update',
      data: { document_id },
      read: false,
      inserted_at: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleApprovalRequest = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { message, document_title, document_id } = customEvent.detail;

    const notification: Notification = {
      id: `approval_${Date.now()}`,
      message: `Approval needed: ${document_title}`,
      event_type: 'approval_request',
      data: { document_id },
      read: false,
      inserted_at: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleCollaborationInvite = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { inviter_name, document_title, document_id } = customEvent.detail;

    const notification: Notification = {
      id: `collab_${Date.now()}`,
      message: `${inviter_name} invited you to collaborate on ${document_title}`,
      event_type: 'collaboration_invite',
      data: { document_id },
      read: false,
      inserted_at: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleWorkflowStatus = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { status, workflow_name, workflow_id } = customEvent.detail;

    const notification: Notification = {
      id: `workflow_${Date.now()}`,
      message: `Workflow ${workflow_name} is now ${status}`,
      event_type: 'workflow_status',
      data: { workflow_id },
      read: false,
      inserted_at: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!connected || !socket) return;

    window.addEventListener('notification', handleNewNotification);
    window.addEventListener('document_update', handleDocumentUpdate);
    window.addEventListener('approval_request', handleApprovalRequest);
    window.addEventListener('collaboration_invite', handleCollaborationInvite);
    window.addEventListener('workflow_status', handleWorkflowStatus);

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
  }, [
    connected,
    socket,
    handleNewNotification,
    handleDocumentUpdate,
    handleApprovalRequest,
    handleCollaborationInvite,
    handleWorkflowStatus,
  ]);

  useEffect(() => {
    if (connected && !notificationsInitialized) {
      fetchNotifications();
    }
  }, [connected, notificationsInitialized, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    paginationMeta,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    clearNotifications,
  };
};

export default useNotifications;
