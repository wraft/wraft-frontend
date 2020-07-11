import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass';

import ThemeList from '../../src/components/PipelineList'
import Page from '../../src/components/Page';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>          
          <ThemeList />
        </Box>
      </Page>
    </>
  );
};

export default Index;
