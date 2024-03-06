import React from 'react';
import { useRouter } from 'next/router';
import { Flex, Box, Text } from 'theme-ui';

import { menuLinksProps } from '../utils';
import NavLink from './NavLink';

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
    <Flex
      sx={{
        flexDirection: 'column',
        gap: '8px',
        pl: 0,
        mr: 4,
        flexShrink: 0,
        maxHeight: '90vh',
        borderColor: 'border',
      }}>
      {items &&
        items.map((item: any) => (
          <Box
            sx={{
              cursor: 'pointer',
              width: '100%',
            }}
            key={item.name}>
            <NavLink href={item.path} variant="links.base">
              <Flex
                sx={{
                  cursor: 'pointer',
                  py: '6px',
                  px: '12px',
                  minWidth: '135px',
                  width: '100%',
                  color: 'gray.900',
                  borderRadius: '4px',
                  alignItems: 'center',
                  bg: checkActive(item.path) ? 'neutral.200' : 'transparent',
                  ':hover': { bg: 'neutral.200' },
                }}>
                {item.lgoo && (
                  <Box
                    sx={{
                      color: 'gray.500',
                      mr: '12px',
                    }}>
                    {item.logo}
                  </Box>
                )}
                <Text
                  variant="pM"
                  sx={{
                    width: '100%',
                    color: 'inherit',
                  }}>
                  {item.name}
                </Text>
              </Flex>
            </NavLink>
            {showFull && <Box />}
          </Box>
        ))}
    </Flex>
  );
};

export default ManageSidebar;
