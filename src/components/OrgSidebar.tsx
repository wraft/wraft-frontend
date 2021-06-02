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

const OrgSidebar = (_props: INav) => {
  return (
    <Box
      sx={{
        width: '22%',
        borderRight: 'solid 1px',
        borderColor: 'gray.3',
        pt: 3,
        pl: 3,
      }}>
      <NavLink href={'/account'}  variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>My Profile</Text>
      </NavLink>
      <NavLink href={'/account/company'}  variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Manage Company</Text>
      </NavLink>
      <NavLink href={'/account/permissions'}  variant="btnNavLink">
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Permissions</Text>
      </NavLink>
      <NavLink href={'/account/members'} variant="btnNavLink" >
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Members</Text>
      </NavLink>      
    </Box>
  );
};

export default OrgSidebar;
