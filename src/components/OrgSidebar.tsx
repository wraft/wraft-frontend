import React from 'react';
import { Box, Text } from 'theme-ui';
import styled from '@emotion/styled';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import NavLink from './NavLink';

export interface INav {
  showFull?: boolean;
}

const OrgSidebar = () => {
  return (
    <Box
      sx={{
        width: '22%',
        borderRight: 'solid 1px',
        borderColor: 'neutral.1',
        minHeight: '80vh',
        pt: 3,
        pl: 3,
      }}>
      <NavLink href={'/account'} variant="btnNavLink">
        My Profile
      </NavLink>
      <NavLink href={'/account/company'} variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Manage Company</Text>
      </NavLink>
      <NavLink href={'/account/roles'} variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Roles</Text>
      </NavLink>
      <NavLink href={'/account/members'} variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Members</Text>
      </NavLink>
      <NavLink href={'/account/checks'} variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Checks</Text>
      </NavLink>
    </Box>
  );
};

export default OrgSidebar;
