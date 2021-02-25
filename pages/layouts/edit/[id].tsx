import { FC } from 'react';
import Head from 'next/head';
import LayoutForm from '../../../src/components/LayoutForm';
import Page from '../../../src/components/Page';
import { Box } from 'rebass';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <LayoutForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
