import React from 'react';

import styled from '@emotion/styled';

import { profileLinks } from '../utils';

import ManageSidebar from './ManageSidebar';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

export interface INav {
  showFull?: boolean;
}

const OrgSidebar = () => {
  return <ManageSidebar items={profileLinks} />;
};

export default OrgSidebar;
