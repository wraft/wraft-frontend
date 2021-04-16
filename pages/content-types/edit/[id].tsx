import { FC } from 'react';
import Head from 'next/head';
import ContentTypeForm from '../../../src/components/ContentTypeForm';
import Page from '../../../src/components/Page';
import { Box } from 'rebass';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <Box>
          <ContentTypeForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
