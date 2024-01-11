import React from 'react';

import styled from '@emotion/styled';
import { Flex, Box, Text } from 'theme-ui';

import { LayoutLogo, FlowLogo, ThemeLogo, PermLogo, Layout } from './Icons';
import NavLink from './NavLink';
import PageHeader from './PageHeader';

export interface INav {
  showFull?: boolean;
}

const listMenu = [
  {
    name: 'Workspace',
    logo: <PermLogo />,
    path: '/manage/workspace',
    desc: 'Manage RBAC',
  },
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
  // {
  //   name: 'Roles',
  //   logo: <PermLogo />,
  //   path: '/manage/roles',
  //   desc: 'Manage RBAC',
  // },
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
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
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
          {/* <Text as="h5" sx={{ color: 'gray.800' }}>Functionary Labs</Text>
            <Text as="p" sx={{ color: 'gray.500', fontSize: 0 }}>Bengaluru, India</Text> */}
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
                borderColor: 'border',
                bg: 'backgroundWhite',
                // width: '240px',
                // borderColor: 'teal.800',
                borderRadius: 4,
                py: 4,
                mb: 4,
                px: 4,
                ':hover': { bg: 'teal.100', borderColor: 'border' },
                color: 'teal.900',
                svg: {
                  fill: 'teal.300',
                },
              }}>
              <NavLink href={l.path} locale={''}>
                <Flex>
                  <Box
                    sx={{
                      width: '4rem',
                      height: '4rem',
                      mb: 1,
                      mr: 1,
                      color: 'gray.800',
                      svg: {
                        fill: 'teal.700',
                      },
                    }}>
                    {l.logo}
                  </Box>
                  <Box sx={{ pl: 3, pr: 2 }}>
                    <Text
                      as="h5"
                      sx={{
                        fontSize: 2,
                        color: 'gray.800',
                        fontWeight: 'heading',
                        mb: 0,
                      }}>
                      {l.name}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 2,
                        fontWeight: 'body',
                        color: 'gray.500',
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
