import { FC } from 'react';
import Head from 'next/head';
import { Flex, Box, Container } from 'theme-ui';

import FlowList from '../../../components/FlowList';
import Page from '../../../components/PageFrame';
import Link from '../../../components/NavLink';

import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Flows - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>

      <Page>
        <Container sx={{ pl: 4, pt: 4 }}>
          <Box>
            <Box sx={{ ml: 'auto' }}>
              <Link variant="btnPrimary" href="/manage/flows/new">
                Add Flow
              </Link>
            </Box>
          </Box>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
