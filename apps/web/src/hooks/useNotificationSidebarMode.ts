import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  workspaceLinks,
  PersonalWorkspaceLinks,
  notificationSidebarLinks,
} from '@constants/menuLinks';

const NOTIFICATION_MODE_KEY = 'wraft_from_notifications';

export function useNotificationSidebarMode(currentOrgName?: string) {
  const router = useRouter();
  const [fromNotification, setFromNotification] = useState(false);

  const enableNotificationMode = () => {
    sessionStorage.setItem(NOTIFICATION_MODE_KEY, '1');
    setFromNotification(true);
  };

  const disableNotificationMode = () => {
    sessionStorage.removeItem(NOTIFICATION_MODE_KEY);
    setFromNotification(false);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const queryFrom = Array.isArray(router.query.from)
      ? router.query.from[0]
      : router.query.from;

    if (queryFrom === 'notifications') {
      enableNotificationMode();
      router.replace(router.pathname, undefined, { shallow: true });
      return;
    }

    const isFlagSet = sessionStorage.getItem(NOTIFICATION_MODE_KEY) === '1';
    setFromNotification(isFlagSet);
  }, [router.isReady, router.query.from]);

  const itemsForSidebar =
    currentOrgName !== 'Personal'
      ? workspaceLinks
      : fromNotification
        ? notificationSidebarLinks
        : PersonalWorkspaceLinks;

  return {
    fromNotification,
    itemsForSidebar,
    clearNotificationSidebarMode: disableNotificationMode,
  };
}
