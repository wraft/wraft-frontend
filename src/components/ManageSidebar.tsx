import React from 'react';
import { Flex, Box, Text } from 'theme-ui';
import styled from '@emotion/styled';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import NavLink from './NavLink';
import { menuLinksProps } from '../utils';

export interface INav {
  showFull?: boolean;
  items: menuLinksProps[];
}

const ManageSidebar = ({ items, showFull = true }: INav) => {
  return (
    <Box
      sx={{
        mt: 4,
        pl: 0,
        mr: 4,
        maxHeight: '90vh',
        // borderRight: 'solid 1px',
        borderColor: 'gray.0',
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
                  width: '100%',
                  color: 'gray.8',
                  borderRadius: '4px',
                  ':hover': { bg: 'neutral.1' },
                }}>
                <Box
                  sx={{
                    color: 'gray.5',
                  }}>
                  {l.logo}
                </Box>
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
