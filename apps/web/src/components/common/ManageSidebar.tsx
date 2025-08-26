import React from 'react';
import { useRouter } from 'next/router';
import { Flex, Box, Text } from '@wraft/ui';

import { menuLinksProps } from '@constants/menuLinks';
import NavLink from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';
import { checkSubRoutePermission } from 'utils/permissions';

export interface INav {
  showFull?: boolean;
  items: menuLinksProps[];
}

const ManageSidebar = ({ items }: INav) => {
  const router = useRouter();
  const { permissions } = useAuth();

  const checkActive = (route: string) => {
    return router.pathname === route;
  };

  const filteredItems = permissions
    ? checkSubRoutePermission(items, permissions)
    : items;

  return (
    <Flex direction="column" gap="sm" borderColor="border">
      {filteredItems &&
        filteredItems.map((item: any) => (
          <NavLink href={item.path} variant="links.base" key={item.name}>
            <Box
              bg={checkActive(item.path) ? 'neutral.200' : 'transparent'}
              w="100%"
              flex={1}
              minWidth="150px"
              px="md"
              py="sm">
              {item.icon && <Box color="gray.500">{item.icon}</Box>}
              <Text>{item.name}</Text>
            </Box>
          </NavLink>
        ))}
    </Flex>
  );
};

export default ManageSidebar;
