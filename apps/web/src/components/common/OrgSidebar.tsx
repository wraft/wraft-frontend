import React from 'react';
import styled from '@emotion/styled';

import { userSettingsLinks } from '@constants/menuLinks';
import { useAuth } from 'contexts/AuthContext';
import { checkSubRoutePermission } from 'utils/permissions';

import ManageSidebar from './ManageSidebar';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

export interface INav {
  showFull?: boolean;
}

const OrgSidebar = () => {
  const { permissions } = useAuth();
  const routers = checkSubRoutePermission(userSettingsLinks, permissions);

  return <ManageSidebar items={routers} />;
};

export default OrgSidebar;
