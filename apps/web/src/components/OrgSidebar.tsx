import React from 'react';
import styled from '@emotion/styled';

import { useAuth } from '../contexts/AuthContext';
import { checkSubRoutePermission } from '../utils';
import ManageSidebar from './ManageSidebar';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

export interface INav {
  showFull?: boolean;
}

export interface menuLinksProps {
  name: string;
  path: string;
  permissionName?: string;
  logo?: any;
  permissions?: any;
}

const profileLinks: menuLinksProps[] = [
  {
    name: 'My Account',
    path: '/account/profile',
  },
  {
    name: 'Manage Workspace',
    path: '/account/company',
    permissionName: 'organisation',
    permissions: ['show'],
  },
  {
    name: 'Change Password',
    path: '/account/change-password',
  },
];

const OrgSidebar = () => {
  const { permissions } = useAuth();
  const routers = checkSubRoutePermission(profileLinks, permissions);

  return <ManageSidebar items={routers} />;
};

export default OrgSidebar;
