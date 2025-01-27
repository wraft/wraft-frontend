import React from 'react';
import { useRouter } from 'next/router';
import { Flex, Box, Text } from '@wraft/ui';

import NavLink from 'common/NavLink';
import { menuLinksProps } from 'utils';

export interface INav {
  showFull?: boolean;
  items: menuLinksProps[];
}

const ManageSidebar = ({ items, showFull = true }: INav) => {
  const router = useRouter();

  const checkActive = (route: string) => {
    return router.pathname === route;
  };

  return (
    <Flex direction="column" gap="sm" px="sm" borderColor="border">
      {items &&
        items.map((item: any) => (
          <NavLink href={item.path} variant="links.base" key={item.name}>
            <Box
              bg={checkActive(item.path) ? 'neutral.200' : 'transparent'}
              w="100%"
              flex={1}
              minWidth="150px"
              px="sm"
              py="xs">
              {item.lgoo && <Box color="gray.500">{item.logo}</Box>}
              <Text>{item.name}</Text>
            </Box>
          </NavLink>
        ))}
    </Flex>
  );
};

export default ManageSidebar;
