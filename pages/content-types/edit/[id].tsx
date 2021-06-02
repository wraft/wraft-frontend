import { FC } from 'react';
import Head from 'next/head';
import ContentTypeForm from '../../../src/components/ContentTypeForm';
import Page from '../../../src/components/PageFrame';
import { Box } from 'theme-ui';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <Box sx={{ pl: 4}}>
          <ContentTypeForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
