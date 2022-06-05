import { FC } from 'react';
import Head from 'next/head';
import FieldTypeForm from '../../../components/FieldTypeForm';
import Page from '../../../components/Page';
import { Box } from 'theme-ui';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <FieldTypeForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
