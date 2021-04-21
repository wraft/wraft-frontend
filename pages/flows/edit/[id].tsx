import { FC } from 'react';
import Head from 'next/head';
import FlowForm from '../../../src/components/FlowForm';
import Page from '../../../src/components/Page';
import { Box } from 'rebass';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Flow - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <FlowForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
