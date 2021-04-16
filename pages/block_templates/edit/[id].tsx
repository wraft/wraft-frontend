import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../../src/components/BlockTemplateForm';
import Page from '../../../src/components/Page';
import { Box } from 'rebass';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit TemplateForm - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <TemplateForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
