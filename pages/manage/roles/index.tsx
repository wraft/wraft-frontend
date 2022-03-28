import { FC } from 'react';
import Head from 'next/head';
import { Box, Text, Container, Flex } from 'theme-ui';
import Page from '../../../src/components/PageFrame';
import ManageSidebar from '../../../src/components/ManageSidebar';
import OrgRolesList from '../../../src/components/OrgRolesList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Roles - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Container variant="layout.pageFrame">
          <Box sx={{ py: 4, borderBottom: 'solid 1px #ddd'}}>
            <Text variant="text.pageTitle">Manage Roles</Text>
          </Box>
          <Flex>
            <ManageSidebar />
            <Box>             
              <Box>
                <OrgRolesList />
              </Box>
            </Box>
            
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
