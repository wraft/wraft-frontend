import React from 'react';
import NavLink from 'next/link';
import styled from '@emotion/styled';
import { Flex, Box, Text, Grid } from '@wraft/ui';
import {
  Layout,
  BuildingOffice,
  IntersectSquare,
  PaintRoller,
  FileArrowUp,
} from '@phosphor-icons/react';

import PageHeader from 'common/PageHeader';

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
  {
    name: 'Import',
    logo: <FileArrowUp size={50} weight="thin" />,
    path: '/manage/import',
    desc: 'Import Structs',
  },
];

const ManageHomePage = () => {
  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="Manage" desc="Manage Variants" />

      <Grid templateColumns="repeat(2, 1fr)" p="lg" gap="md" w="70%">
        {listMenu &&
          listMenu.map((menu: any, index: any) => (
            <NavLink href={menu.path} key={index}>
              <Flex
                alignItems="center"
                bg="background-primary"
                border="solid 1px"
                borderColor="border"
                borderRadius="sm"
                gap="md"
                p="md">
                <Box>{menu.logo}</Box>
                <Box pl={3} pr={2}>
                  <Text fontWeight="heading">{menu.name}</Text>
                  <Text color="text-secondary">{menu.desc}</Text>
                </Box>
              </Flex>
            </NavLink>
          ))}
      </Grid>
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
