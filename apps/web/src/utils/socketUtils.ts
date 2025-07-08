import { Socket, Channel } from 'phoenix';

export interface NotificationPayload {
  type: string;
  message: string;
  data?: any;
  user_id?: string;
  organisation_id?: string;
}

export interface DocumentUpdatePayload {
  document_id: string;
  user_name: string;
  action: 'created' | 'updated' | 'deleted' | 'published';
  document_title?: string;
}

export interface ApprovalRequestPayload {
  document_id: string;
  document_title: string;
  message: string;
  requester_name: string;
  approval_id: string;
}

export interface CollaborationInvitePayload {
  document_id: string;
  document_title: string;
  inviter_name: string;
  inviter_id: string;
  role: 'editor' | 'viewer' | 'reviewer';
}

export interface WorkflowStatusPayload {
  workflow_id: string;
  workflow_name: string;
  status: 'started' | 'completed' | 'failed' | 'paused';
  message?: string;
}

/**
 * Utility class for handling Phoenix Socket operations
 */
export class SocketUtils {
  private socket: Socket | null = null;
  private channels: Map<string, Channel> = new Map();

  constructor(socketUrl: string, params: any = {}) {
    this.socket = new Socket(`${socketUrl}/socket`, {
      params,
      logger: (kind, msg, data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Phoenix ${kind}: ${msg}`, data);
        }
      },
    });
  }

  /**
   * Connect to the Phoenix socket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.onOpen(() => {
        console.log('Phoenix socket connected');
        resolve();
      });

      this.socket.onError((error) => {
        console.error('Phoenix socket error:', error);
        reject(error);
      });

      this.socket.connect();
    });
  }

  /**
   * Disconnect from the Phoenix socket
   */
  disconnect(): void {
    if (this.socket) {
      this.channels.forEach((channel) => {
        channel.leave();
      });
      this.channels.clear();
      this.socket.disconnect();
    }
  }

  /**
   * Join a channel
   */
  joinChannel(channelName: string, params: any = {}): Promise<Channel> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      // Check if channel already exists
      if (this.channels.has(channelName)) {
        resolve(this.channels.get(channelName)!);
        return;
      }

      const channel = this.socket.channel(channelName, params);

      channel
        .join()
        .receive('ok', (resp) => {
          console.log(`Joined channel ${channelName}`, resp);
          this.channels.set(channelName, channel);
          resolve(channel);
        })
        .receive('error', (resp) => {
          console.error(`Failed to join channel ${channelName}`, resp);
          reject(
            new Error(
              `Failed to join channel: ${resp.reason || 'Unknown error'}`,
            ),
          );
        });
    });
  }

  /**
   * Leave a channel
   */
  leaveChannel(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.leave();
      this.channels.delete(channelName);
    }
  }

  /**
   * Send a message to a channel
   */
  sendMessage(channelName: string, event: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const channel = this.channels.get(channelName);
      if (!channel) {
        reject(new Error(`Channel ${channelName} not found`));
        return;
      }

      channel
        .push(event, payload)
        .receive('ok', resolve)
        .receive('error', reject);
    });
  }

  /**
   * Subscribe to notifications for a user
   */
  async subscribeToNotifications(userId: string): Promise<Channel> {
    const channel = await this.joinChannel(`notification:${userId}`);

    // Set up common event handlers
    channel.on('new_notification', (payload: NotificationPayload) => {
      this.handleNotification(payload);
    });

    channel.on('document_updated', (payload: DocumentUpdatePayload) => {
      this.handleDocumentUpdate(payload);
    });

    channel.on('approval_request', (payload: ApprovalRequestPayload) => {
      this.handleApprovalRequest(payload);
    });

    channel.on(
      'collaboration_invite',
      (payload: CollaborationInvitePayload) => {
        this.handleCollaborationInvite(payload);
      },
    );

    channel.on('workflow_status', (payload: WorkflowStatusPayload) => {
      this.handleWorkflowStatus(payload);
    });

    return channel;
  }

  /**
   * Subscribe to document collaboration events
   */
  async subscribeToDocumentEvents(documentId: string): Promise<Channel> {
    const channel = await this.joinChannel(`document:${documentId}`);

    channel.on('user_joined', (payload) => {
      console.log('User joined document:', payload);
      window.dispatchEvent(
        new CustomEvent('document_user_joined', { detail: payload }),
      );
    });

    channel.on('user_left', (payload) => {
      console.log('User left document:', payload);
      window.dispatchEvent(
        new CustomEvent('document_user_left', { detail: payload }),
      );
    });

    channel.on('content_changed', (payload) => {
      console.log('Document content changed:', payload);
      window.dispatchEvent(
        new CustomEvent('document_content_changed', { detail: payload }),
      );
    });

    return channel;
  }

  /**
   * Subscribe to organization-wide events
   */
  async subscribeToOrganizationEvents(
    organizationId: string,
  ): Promise<Channel> {
    const channel = await this.joinChannel(`organization:${organizationId}`);

    channel.on('member_added', (payload) => {
      console.log('Member added to organization:', payload);
      window.dispatchEvent(
        new CustomEvent('org_member_added', { detail: payload }),
      );
    });

    channel.on('member_removed', (payload) => {
      console.log('Member removed from organization:', payload);
      window.dispatchEvent(
        new CustomEvent('org_member_removed', { detail: payload }),
      );
    });

    channel.on('settings_updated', (payload) => {
      console.log('Organization settings updated:', payload);
      window.dispatchEvent(
        new CustomEvent('org_settings_updated', { detail: payload }),
      );
    });

    return channel;
  }

  // Event handlers
  private handleNotification(payload: NotificationPayload): void {
    window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
  }

  private handleDocumentUpdate(payload: DocumentUpdatePayload): void {
    window.dispatchEvent(
      new CustomEvent('document_update', { detail: payload }),
    );
  }

  private handleApprovalRequest(payload: ApprovalRequestPayload): void {
    window.dispatchEvent(
      new CustomEvent('approval_request', { detail: payload }),
    );
  }

  private handleCollaborationInvite(payload: CollaborationInvitePayload): void {
    window.dispatchEvent(
      new CustomEvent('collaboration_invite', { detail: payload }),
    );
  }

  private handleWorkflowStatus(payload: WorkflowStatusPayload): void {
    window.dispatchEvent(
      new CustomEvent('workflow_status', { detail: payload }),
    );
  }
}

/**
 * Helper function to create notification event listeners
 */
export const createNotificationListener = (
  eventType: string,
  callback: (payload: any) => void,
): (() => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };

  window.addEventListener(eventType, handler);

  // Return cleanup function
  return () => {
    window.removeEventListener(eventType, handler);
  };
};

/**
 * Helper function to format notification messages
 */
export const formatNotificationMessage = (type: string, data: any): string => {
  switch (type) {
    case 'document_update':
      return `${data.user_name} ${data.action} "${data.document_title}"`;
    case 'approval_request':
      return `Approval needed for "${data.document_title}"`;
    case 'collaboration_invite':
      return `${data.inviter_name} invited you to collaborate on "${data.document_title}"`;
    case 'workflow_status':
      return `Workflow "${data.workflow_name}" is now ${data.status}`;
    default:
      return data.message || 'New notification';
  }
};

export default SocketUtils;
