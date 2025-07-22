import { Box } from '@wraft/ui';
import {
  Layout,
  BuildingOffice,
  IntersectSquare,
  PaintRoller,
  FileArrowUp,
  Money,
} from '@phosphor-icons/react';

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
];

export const PersonalWorkspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
    permissions: ['workspace.update', 'workspace.delete', 'workspace.invite'],
  },
  {
    name: 'Fields',
    path: '/manage/fields',
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
    icon: <BuildingOffice size={32} weight="thin" />,
    path: '/manage/workspace',
    desc: 'Manage RBAC',
  },
  {
    name: 'Layouts',
    icon: <Layout size={32} weight="thin" />,
    path: '/manage/layouts',
    desc: 'Manage Document Structures',
    permissions: ['layout.show', 'layout.manage'],
  },
  {
    name: 'Flows',
    icon: <IntersectSquare size={32} weight="thin" />,
    path: '/manage/flows',
    desc: 'Manage Document Flows',
    permissions: ['flow.show', 'flow.manage'],
  },

  {
    name: 'Themes',
    icon: <PaintRoller size={32} weight="thin" />,
    path: '/manage/themes',
    desc: 'Manage Themes',
    permissions: ['theme.show', 'theme.manage'],
  },
  {
    name: 'Import',
    icon: <FileArrowUp size={32} weight="thin" />,
    path: '/manage/import',
    desc: 'Import Structs',
  },
  {
    name: 'Billing & Subscription',
    icon: <Money size={32} weight="thin" />,
    path: '/manage/billing',
    desc: 'Manage Billing and Subscription',
    permissions: ['payment.show'],
  },
];
