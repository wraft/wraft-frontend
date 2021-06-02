import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import ManageSidebar from '../../src/components/ManageView';
import Page from '../../src/components/PageFrame';
import { HeadingFrame } from '../../src/components/Card';
// <HeadingFrame title="Manage"/>
const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame title="Manage" />
        <Box variant="layout.pageFrame" sx={{ mt: 0, pt: 0 }}>
          <ManageSidebar />
        </Box>
      </Page>
    </>
  );
};

export default Index;
