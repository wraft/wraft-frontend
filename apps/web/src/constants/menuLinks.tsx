import { Box } from '@wraft/ui';
import {
  LayoutIcon,
  BuildingOfficeIcon,
  IntersectSquareIcon,
  PaintRollerIcon,
  FileArrowUpIcon,
  MoneyIcon,
  StorefrontIcon,
  LightningIcon,
} from '@phosphor-icons/react';

import { envConfig } from 'utils/env';

export interface menuLinksProps {
  name: string;
  path: string;
  icon?: any;
  role?: any;
  permissions?: string[];
  desc?: string;
}

export const menuLinks: menuLinksProps[] = [
  {
    name: 'Layouts',
    icon: <Box w="20px" />,
    path: '/manage/layouts',
    permissions: ['layout.show', 'layout.manage'],
  },
  {
    name: 'Flows',
    icon: <Box w="20px" />,
    path: '/manage/flows',
    permissions: ['flow.show', 'flow.manage'],
  },

  {
    name: 'Themes',
    icon: <Box w="20px" />,
    path: '/manage/themes',
    permissions: ['theme.show', 'theme.manage'],
  },
  {
    name: 'Webhooks',
    icon: <Box w="20px" />,
    path: '/manage/webhooks',
    permissions: ['theme.show', 'theme.show'],
  },
];

export const PersonalWorkspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
    permissions: ['workspace.update', 'workspace.delete', 'workspace.invite'],
  },
];

export const workspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
    permissions: ['workspace.update', 'workspace.delete', 'workspace.invite'],
  },
  {
    name: 'Fields',
    path: '/manage/workspace/fields',
    permissions: ['workspace.update', 'workspace.delete', 'workspace.invite'],
  },
  {
    name: 'Members',
    path: '/manage/workspace/members',
    permissions: ['members.manage', 'members.show'],
  },
  {
    name: 'Roles',
    path: '/manage/workspace/roles',
    permissions: ['role.show', 'role.manage', 'role.delete'],
  },
  {
    name: 'Permissions',
    path: '/manage/workspace/permissions',
    permissions: ['role.show', 'role.manage'],
  },
  {
    name: 'Notification',
    path: '/manage/workspace/notification-settings',
    permissions: [],
  },
  {
    name: 'Webhooks',
    path: '/manage/workspace/webhooks',
    permissions: ['webhook.show', 'webhook.manage'],
  },
];

export const userSettingsLinks: menuLinksProps[] = [
  {
    name: 'My Account',
    path: '/account/profile',
  },
  {
    name: 'Change Password',
    path: '/account/change-password',
  },
];

export const workspaceMenu: menuLinksProps[] = [
  {
    name: 'Workspace',
    icon: <BuildingOfficeIcon size={32} weight="thin" />,
    path: '/manage/workspace',
    desc: 'Manage RBAC',
  },
  {
    name: 'Layouts',
    icon: <LayoutIcon size={32} weight="thin" />,
    path: '/manage/layouts',
    desc: 'Manage Document Structures',
    permissions: ['layout.show', 'layout.manage'],
  },
  {
    name: 'Flows',
    icon: <IntersectSquareIcon size={32} weight="thin" />,
    path: '/manage/flows',
    desc: 'Manage Document Flows',
    permissions: ['flow.show', 'flow.manage'],
  },
  {
    name: 'Themes',
    icon: <PaintRollerIcon size={32} weight="thin" />,
    path: '/manage/themes',
    desc: 'Manage Themes',
    permissions: ['theme.show', 'theme.manage'],
  },
  {
    name: 'Webhooks',
    icon: <LightningIcon size={32} weight="thin" />,
    path: '/manage/workspace/webhooks',
    desc: 'Manage Webhooks',
    permissions: ['webhook.show', 'webhook.manage'],
  },
  {
    name: 'Import',
    icon: <FileArrowUpIcon size={32} weight="thin" />,
    path: '/manage/import',
    desc: 'Import Structs',
  },
  {
    name: 'Vendors',
    icon: <StorefrontIcon size={32} weight="thin" />,
    path: '/vendors',
    desc: 'Manage Vendors',
    permissions: ['vendor.show', 'vendor.manage'],
  },
  ...(envConfig.SELF_HOST_DISABLED
    ? [
        {
          name: 'Billing & Subscription',
          icon: <MoneyIcon size={32} weight="thin" />,
          path: '/manage/billing',
          desc: 'Manage Billing and Subscription',
          permissions: ['payment.show'],
        },
      ]
    : []),
];

export const NOTIFICATION_LINK_NAMES = ['General', 'Notification'];

export const notificationSidebarLinks: menuLinksProps[] = workspaceLinks.filter(
  (link) => NOTIFICATION_LINK_NAMES.includes(link.name),
);
