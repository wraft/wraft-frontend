import { useRouter } from 'next/router';

export interface NotificationData {
  document_id?: string;
  workflow_id?: string;
}

export interface NotificationMeta {
  document_id?: string;
}

export interface ActorData {
  id: string;
  name: string;
  profile_pic: string;
}

export interface Notification {
  id: string;
  event_type: string;
  message: string;
  read: boolean;
  data?: NotificationData;
  meta?: NotificationMeta;
  inserted_at: string;
  actor?: ActorData;
}

export const NOTIFICATION_TYPES = {
  DOCUMENT_UPDATE: 'document.update',
  APPROVAL_REQUEST: 'approval.request',
  COLLABORATION_INVITE: 'collaboration.invite',
  WORKFLOW_STATUS: 'workflow.status',
  DOCUMENT_COMMENT: 'document.add_comment',
} as const;

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case NOTIFICATION_TYPES.DOCUMENT_UPDATE:
      return '📄';
    case NOTIFICATION_TYPES.APPROVAL_REQUEST:
      return '✅';
    case NOTIFICATION_TYPES.COLLABORATION_INVITE:
      return '🤝';
    case NOTIFICATION_TYPES.WORKFLOW_STATUS:
      return '⚡';
    case NOTIFICATION_TYPES.DOCUMENT_COMMENT:
      return '💬';
    default:
      return '📢';
  }
};

export const handleNotificationNavigation = (
  notification: Notification,
  router: ReturnType<typeof useRouter>,
): void => {
  if (
    notification.event_type === NOTIFICATION_TYPES.DOCUMENT_UPDATE &&
    notification.data?.document_id
  ) {
    router.push(`/documents/${notification.data.document_id}`);
  } else if (
    notification.event_type === NOTIFICATION_TYPES.APPROVAL_REQUEST &&
    notification.data?.document_id
  ) {
    router.push(`/approvals?document_id=${notification.data.document_id}`);
  } else if (
    notification.event_type === NOTIFICATION_TYPES.COLLABORATION_INVITE &&
    notification.data?.document_id
  ) {
    router.push(`/documents/${notification.data.document_id}`);
  } else if (
    notification.event_type === NOTIFICATION_TYPES.WORKFLOW_STATUS &&
    notification.data?.workflow_id
  ) {
    router.push(`/manage/workflows/${notification.data.workflow_id}`);
  } else if (
    notification.event_type === NOTIFICATION_TYPES.DOCUMENT_COMMENT &&
    notification.meta?.document_id
  ) {
    router.push(`/documents/${notification.meta.document_id}`);
  }
};
