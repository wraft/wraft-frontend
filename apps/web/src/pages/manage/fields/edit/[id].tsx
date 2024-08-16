import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';

import FieldTypeForm from 'components/FieldTypeForm';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Field | Wraft</title>
        <meta name="description" content="edit field" />
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
