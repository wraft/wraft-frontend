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
  const pathname: string = router.pathname as any;
  const checkActive = (pathname: string, m: any) => {
    if (pathname === '/content/[id]' && m.path === '/contents') {
      return true;
    }

    return m.path === pathname;
  };
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: '12px',
        pl: 0,
        mr: 4,
        flexShrink: 0,
        maxHeight: '90vh',
        borderColor: 'border',
      }}>
      {items &&
        items.map((l: any) => (
          <Box
            sx={{
              width: '100%',
            }}
            key={l.name}>
            <NavLink href={l.path} variant="links.base">
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
                  bg: checkActive(pathname, l.path)
                    ? 'neutral.200'
                    : 'transparent',
                  ':hover': { bg: 'neutral.200' },
                }}>
                {l.lgoo && (
                  <Box
                    sx={{
                      color: 'gray.500',
                      mr: '12px',
                    }}>
                    {l.logo}
                  </Box>
                )}
                <Text
                  variant="pM"
                  sx={{
                    width: '100%',
                    color: 'inherit',
                  }}>
                  {l.name}
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
