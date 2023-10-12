import React from 'react';
import styled from '@emotion/styled';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

// import NavLink from './NavLink';
import ManageSidebar from './ManageSidebar';
import { profileLinks } from '../utils';

export interface INav {
  showFull?: boolean;
}

const OrgSidebar = () => {
  return <ManageSidebar items={profileLinks} />;
};

export default OrgSidebar;
