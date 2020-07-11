import React from 'react';
import Head from 'next/head';
import PipelineView from '../../../src/components/PipelineView';
import Page from '../../../src/components/Page';
import { Box } from 'rebass';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Edit Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <PipelineView />
        </Box>
      </Page>        
    </>
  );
};

export default Index;
