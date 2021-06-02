import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import ApprovalList from '../../src/components/ApprovalList';
import Page from '../../src/components/PageFrame';

import { HeadingFrame } from '../../src/components/Card';


const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame title="Approvals" />
        <Box sx={{ pl: 4}}>
          <ApprovalList />
        </Box>
      </Page>
    </>
  );
};

export default Index;
