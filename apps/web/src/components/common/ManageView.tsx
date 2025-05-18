import React from 'react';
import NavLink from 'next/link';
import styled from '@emotion/styled';
import { Flex, Box, Text, Grid } from '@wraft/ui';

import { workspaceMenu } from '@constants/menuLinks';
import PageHeader from 'common/PageHeader';
import { useAuth } from 'contexts/AuthContext';
import { checkSubRoutePermission } from 'utils/permissions';

import { IconFrame } from './Atoms';

export interface INav {
  showFull?: boolean;
}

const ManageHomePage = () => {
  const { permissions } = useAuth();

  const mainMenu = permissions
    ? checkSubRoutePermission(workspaceMenu, permissions)
    : workspaceMenu;

  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="Manage" desc="Manage Variants" />

      <Grid templateColumns="repeat(2, 1fr)" p="xl" gap="lg" w="70%">
        {mainMenu &&
          mainMenu.map((menu: any, index: any) => (
            <NavLink href={menu.path} key={index}>
              <Flex
                alignItems="center"
                bg="background-primary"
                border="solid 1px"
                borderColor="border"
                borderRadius="md"
                gap="md"
                p="md">
                <Box>
                  <IconFrame color="gray.800">{menu.icon}</IconFrame>
                </Box>
                <Box pl={3} pr={2}>
                  <Text fontSize="sm2" fontWeight="medium">
                    {menu.name}
                  </Text>
                  <Text fontSize="sm2" color="text-secondary">
                    {menu.desc}
                  </Text>
                </Box>
              </Flex>
            </NavLink>
          ))}
      </Grid>
    </Box>
  );
};

export default ManageHomePage;

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;
