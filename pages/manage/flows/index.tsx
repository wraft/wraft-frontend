import { FC } from 'react';
import Head from 'next/head';
import { Flex, Box, Container } from 'theme-ui';

import FlowList from '../../../src/components/FlowList';
import Page from '../../../src/components/PageFrame';
import Link from '../../../src/components/NavLink';

import ManageSidebar from '../../../src/components/ManageSidebar';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Flows - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      
      <Page>
        <Container sx={{ pl: 4, pt: 4}}>
          <Box>
            <Box sx={{ ml: 'auto' }}>
              <Link variant="btnPrimary" href="/manage/flows/new">
                Add Flow
              </Link>
            </Box>
          </Box>
          <Flex>
            <ManageSidebar items={[]}/>
            <FlowList />            
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
