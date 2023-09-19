import React from 'react';
import { Flex, Box, Text } from 'theme-ui';
import styled from '@emotion/styled';

import PageHeader from './PageHeader';

import { Layout } from '@styled-icons/boxicons-regular';

import NavLink from './NavLink';
import { LayoutLogo, FlowLogo, ThemeLogo, PermLogo } from './Icons';

export interface INav {
  showFull?: boolean;
}

const listMenu = [
  {
    name: 'Layouts',
    logo: <LayoutLogo />,
    path: '/manage/layouts',
    desc: 'Manage Document Structures',
  },
  {
    name: 'Flows',
    logo: <FlowLogo />,
    path: '/manage/flows',
    desc: 'Manage Document Flows',
  },

  {
    name: 'Themes',
    logo: <ThemeLogo />,
    path: '/manage/themes',
    desc: 'Manage Themes',
  },
  {
    name: 'Roles',
    logo: <PermLogo />,
    path: '/manage/roles',
    desc: 'Manage RBAC',
  },
  {
    name: 'Fields',
    logo: <PermLogo />,
    path: '/manage/fields',
    desc: 'Manage Fields',
  },
  {
    name: 'Pipelines',
    logo: <PermLogo />,
    path: '/manage/pipelines',
    desc: 'Manage Pipelines',
  },
];

const ManageHomePage = () => {
  return (
    <Box>
      <PageHeader title="Manage" desc="Manage Variants">
        <Box
          sx={{
            flexGrow: 1,
            ml: 'auto',
            textAlign: 'right',
            mr: 0,
            pt: 2,
            mt: 1,
          }}>
          {/* <NavLink href="/content-types/new" variant="btnSmall"> */}
          {/* <Text as="h5" sx={{ color: 'gray.7' }}>Functionary Labs</Text>
            <Text as="p" sx={{ color: 'gray.4', fontSize: 0 }}>Bengaluru, India</Text> */}
          {/* </NavLink> */}
        </Box>
      </PageHeader>

      <Flex sx={{ pt: 5, px: 4, flexWrap: 'wrap' }}>
        {listMenu &&
          listMenu.map((l: any, index: any) => (
            <Box
              key={index}
              sx={{
                width: '33%',
                mr: 4,
                border: 'solid 1px',
                borderColor: 'neutral.1',
                bg: 'bgWhite',
                // width: '240px',
                // borderColor: 'teal.7',
                borderRadius: 4,
                py: 4,
                mb: 4,
                px: 4,
                ':hover': { bg: 'teal.0', borderColor: 'teal.0' },
                color: 'teal.8',
                svg: {
                  fill: 'teal.2',
                },
              }}>
              <NavLink href={l.path}>
                <Flex>
                  <Box
                    sx={{
                      width: '4rem',
                      height: '4rem',
                      mb: 1,
                      mr: 1,
                      color: 'gray.7',
                      svg: {
                        fill: 'teal.6',
                      },
                    }}>
                    {l.logo}
                  </Box>
                  <Box sx={{ pl: 3, pr: 2 }}>
                    <Text
                      as="h5"
                      sx={{
                        fontSize: 3,
                        color: 'gray.7',
                        fontWeight: 'heading',
                        mb: 0,
                      }}>
                      {l.name}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 2,
                        fontWeight: 'body',
                        color: 'gray.4',
                        mb: 1,
                      }}>
                      {l.desc}
                    </Text>
                  </Box>
                </Flex>
              </NavLink>
            </Box>
          ))}
      </Flex>
    </Box>
  );
};

export default ManageHomePage;

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

export const IconWrapper = styled(Layout)`
  color: '#999';
`;
