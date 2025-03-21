import { Box } from '@wraft/ui';

export interface menuLinksProps {
  name: string;
  path: string;
  icon?: any;
  role?: any;
  permissions?: string[];
}

export const menuLinks: menuLinksProps[] = [
  {
    name: 'Layouts',
    icon: <Box w="20px" />,
    path: '/manage/layouts',
    permissions: ['layouts.read', 'layouts.write'],
  },
  {
    name: 'Flows',
    icon: <Box w="20px" />,
    path: '/manage/flows',
    permissions: ['flows.read', 'flows.write'],
  },

  {
    name: 'Themes',
    icon: <Box w="20px" />,
    path: '/manage/themes',
    permissions: ['themes.read', 'themes.write'],
  },
];

export const PersonalWorkspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
    permissions: [
      'organisation.show',
      'organisation.update',
      'organisation.delete',
    ],
  },
  {
    name: 'Fields',
    path: '/manage/fields',
    permissions: ['organisation.show', 'organisation.update'],
  },
];

export const workspaceLinks: menuLinksProps[] = [
  {
    name: 'General',
    path: '/manage/workspace',
    permissions: ['organisation.show', 'organisation.manage'],
  },
  {
    name: 'Fields',
    path: '/manage/workspace/fields',
    permissions: ['organisation.show', 'organisation.update'],
  },
  {
    name: 'Members',
    path: '/manage/workspace/members',
    permissions: ['members.manage'],
  },
  {
    name: 'Roles',
    path: '/manage/workspace/roles',
    permissions: ['role.show', 'role.manage', 'role.assign'],
  },
  {
    name: 'Permissions',
    path: '/manage/workspace/permissions',
    permissions: ['role_group.show', 'role_group.manage'],
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
