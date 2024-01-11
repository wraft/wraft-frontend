import React from 'react';

import styled from '@emotion/styled';
import { Flex, Box, Text } from 'theme-ui';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import { menuLinksProps } from '../utils';

import NavLink from './NavLink';

export interface INav {
  showFull?: boolean;
  items: menuLinksProps[];
}

const ManageSidebar = ({ items, showFull = true }: INav) => {
  return (
    <Box
      sx={{
        mt: 4,
        ml: 4,
        pl: 0,
        // mr: 4,
        flexShrink: 0,
        maxHeight: '90vh',
        // borderRight: 'solid 1px',
        borderColor: 'border',
        // minHeight: '90vh',
      }}>
      {items &&
        items.map((l: any) => (
          <Box
            sx={{
              // mr: 4,
              width: '100%',
            }}
            key={l.name}>
            <NavLink href={l.path} variant="links.base">
              <Flex
                sx={{
                  py: '6px',
                  px: '12px',
                  minWidth: '135px',
                  width: '100%',
                  color: 'gray.900',
                  borderRadius: '4px',
                  alignItems: 'center',
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
    </Box>
  );
};

export default ManageSidebar;
