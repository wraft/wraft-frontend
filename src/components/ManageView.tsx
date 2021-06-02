import React from 'react';
import { Flex, Box, Text } from 'theme-ui';
import styled from '@emotion/styled';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import { Layout } from '@styled-icons/boxicons-regular';

import NavLink from './NavLink';
import { LayoutLogo, FlowLogo, ThemeLogo, PermLogo } from './Icons';

export const IconWrapper = styled(Layout)`
  color: '#999';
`;

export interface INav {
  showFull?: boolean;
}

const listMenu = [
  {
    name: 'Layouts',
    logo: <LayoutLogo />,
    path: '/manage/layouts',
  },
  {
    name: 'Flows',
    logo: <FlowLogo />,
    path: '/manage/flows',
  },

  {
    name: 'Themes',
    logo: <ThemeLogo />,
    path: '/manage/themes',
  },
  {
    name: 'Roles',
    logo: <PermLogo />,
    path: '/manage/themes',
  },
  {
    name: 'Fields',
    logo: <PermLogo />,
    path: '/manage/fields',
  },
  {
    name: 'Pipelines',
    logo: <PermLogo />,
    path: '/manage/pipelines',
  },
];

const ManageHomePage = (_props: INav) => {
  return (
    <Flex sx={{ pt: 5, pl: 3, flexWrap: 'wrap' }}>
      {listMenu &&
        listMenu.map((l: any, index: any) => (
          <Box
            key={index}
            sx={{
              width: '33%',
              mr: 4,
              border: 'solid 1px',
              bg: 'gray.0',
              // width: '240px',
              borderColor: 'gray.4',
              borderRadius: 4,
              py: 4,
              mb: 4,
              px: 4,
              ':hover': { bg: 'blue.0', borderColor: 'blue.2', },
              color: 'blue.8'
            }}>
            <NavLink href={l.path}>
              <Flex>
                <Box
                  sx={{
                    width: '4rem',
                    height: '4rem',
                    // border: 'solid 1px',
                    // borderColor: 'gray.3',
                    mb: 1,
                    mr: 1,
                    color: 'gray.7',
                    'svg': {
                      fill: 'blue.4'
                    }
                  }}>
                  {l.logo}
                </Box>
                <Box sx={{ pl: 3, pr: 2}}>
                  <Text as="h5" sx={{ fontSize: 1, color: 'gray.7', fontWeight: 'heading', mb: 0 }}>
                    {l.name}
                  </Text>
                  <Text sx={{ fontSize: 1, fontWeight: 'body', color: 'gray.6', mb: 1 }}>
                    Some description of the admin
                  </Text>
                </Box>
              </Flex>
            </NavLink>
          </Box>
        ))}
    </Flex>
  );
};

export default ManageHomePage;
