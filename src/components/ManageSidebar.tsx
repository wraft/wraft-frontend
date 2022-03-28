import React from 'react';
import { Flex, Box, Text } from 'theme-ui';
import styled from '@emotion/styled';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import { Layout, User, Collection } from '@styled-icons/boxicons-regular';

import { Style } from '@styled-icons/material-sharp/Style';
import { FlowBranch } from '@styled-icons/entypo/FlowBranch';

import NavLink from './NavLink';

export const IconWrapper = styled(Layout)`
  color: '#999';
`;

export interface INav {
  showFull?: boolean;
}

// const ICON_COLOR = '#999';

const listMenu = [
  {
    name: 'Layouts',
    logo: <Layout width="20px" />,
    path: '/manage/layouts',
  },
  {
    name: 'Flows',
    logo: <FlowBranch width="20px" />,
    path: '/manage/flows',
  },

  {
    name: 'Themes',
    logo: <Style width="20px" />,
    path: '/manage/themes',
  },
  {
    name: 'Roles',
    logo: <User width="20px" />,
    path: '/manage/roles',
  },
  {
    name: 'Fields',
    logo: <User width="20px" />,
    path: '/manage/fields',
  },
  {
    name: 'Pipelines',
    logo: <Collection width={20} />,
    path: '/manage/pipelines',
  },
];

const ManageSidebar = (_props: INav) => {
  return (
    <Box
      sx={{
        pt: 4,
        pl: 0,
        mr: 4,
        borderRight: 'solid 1px',
        borderColor: 'gray.3',
      }}>
      {listMenu &&
        listMenu.map((l: any) => (
          <Box sx={{ mr: 4 }} key={l.name}>
            <NavLink href={l.path} variant="base1">
              <Flex
                sx={{
                  borderBottom: 'solid 1px',
                  borderColor: 'gray.3',
                  pb: 1,
                  mb: 2,
                }}>
                <Box sx={{ mr: 2, pt: 1, color: 'gray.5' }}>{l.logo}</Box>
                <Text
                  sx={{
                    fontSize: 1,
                    color: 'gray.7',
                    fontWeight: 'body',
                    mb: 1,
                    pt: 1,
                  }}>
                  {l.name}
                </Text>
              </Flex>
            </NavLink>
          </Box>
        ))}
    </Box>
  );
};

export default ManageSidebar;
