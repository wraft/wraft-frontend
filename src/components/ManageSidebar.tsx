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
        pt: 4,
        pl: 0,
        mr: 4,
        borderRight: 'solid 1px',
        borderColor: 'gray.3',
      }}
    >
      {items &&
        items.map((l: any) => (
          <Box sx={{ mr: 4 }} key={l.name}>
            <NavLink href={l.path} variant="base1">
              <Flex
                sx={{
                  borderBottom: 'solid 1px',
                  borderColor: 'gray.3',
                  pb: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ mr: 2, pt: 1, color: 'gray.5' }}>{l.logo}</Box>
                <Text
                  sx={{
                    fontSize: 1,
                    color: 'gray.7',
                    fontWeight: 'body',
                    mb: 1,
                    pt: 1,
                  }}
                >
                  {l.name}
                </Text>
              </Flex>
            </NavLink>
            {showFull && <h1>Full page</h1>}
          </Box>
        ))}
    </Box>
  );
};

export default ManageSidebar;
