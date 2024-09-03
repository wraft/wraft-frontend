import React from 'react';
import NavLink from 'next/link';
import styled from '@emotion/styled';
import { Flex, Box, Text } from 'theme-ui';
import {
  Layout,
  BuildingOffice,
  TreeStructure,
  IntersectSquare,
  PaintRoller,
} from '@phosphor-icons/react';

import PageHeader from './PageHeader';

export interface INav {
  showFull?: boolean;
}

const listMenu = [
  {
    name: 'Workspace',
    logo: <BuildingOffice size={50} weight="thin" />,
    path: '/manage/workspace',
    desc: 'Manage RBAC',
  },
  {
    name: 'Layouts',
    logo: <Layout size={50} weight="thin" />,
    path: '/manage/layouts',
    desc: 'Manage Document Structures',
  },
  {
    name: 'Flows',
    logo: <IntersectSquare size={50} weight="thin" />,
    path: '/manage/flows',
    desc: 'Manage Document Flows',
  },

  {
    name: 'Themes',
    logo: <PaintRoller size={50} weight="thin" />,
    path: '/manage/themes',
    desc: 'Manage Themes',
  },
  // {
  //   name: 'Pipelines',
  //   logo: <TreeStructure size={50} weight="thin" />,
  //   path: '/manage/pipelines',
  //   desc: 'Manage Pipelines',
  // },
];

const ManageHomePage = () => {
  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'gray.100' }}>
      <PageHeader title="Manage" desc="Manage Variants">
        <Box
          sx={{
            flexGrow: 1,
            ml: 'auto',
            textAlign: 'right',
            mr: 0,
            pt: 2,
            mt: 1,
          }}></Box>
      </PageHeader>

      <Flex
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '70%',
          pt: 4,
          px: 4,
        }}>
        {listMenu &&
          listMenu.map((l: any, index: any) => (
            <NavLink href={l.path} key={index}>
              <Box
                sx={{
                  border: 'solid 1px',
                  borderColor: 'gray.400',
                  bg: 'gray.100',
                  borderRadius: 4,
                  ':hover': { bg: 'gray.300', borderColor: 'gray.200' },
                  color: 'teal.1000',
                  svg: {
                    fill: 'green.900',
                  },
                }}>
                <Flex sx={{ py: 4, px: 4, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '4rem',
                      height: '4rem',
                      mb: 1,
                      mr: 1,
                      color: 'gray.800',
                      display: 'contents',
                      svg: {
                        fill: 'green.700',
                      },
                    }}>
                    {l.logo}
                  </Box>
                  <Box sx={{ pl: 3, pr: 2 }}>
                    <Text
                      as="h5"
                      sx={{
                        fontSize: 'sm',
                        color: 'gray.1200',
                        fontWeight: 'bold',
                        mb: 0,
                      }}>
                      {l.name}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 'sm',
                        fontWeight: 'body',
                        color: 'gray.1000',
                        mb: 1,
                      }}>
                      {l.desc}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </NavLink>
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
