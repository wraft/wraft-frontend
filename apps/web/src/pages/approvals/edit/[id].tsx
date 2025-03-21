import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';

import Page from 'common/Page';
import FieldTypeForm from 'common/FieldTypeForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Approvals | Wraft</title>
        <meta name="description" content="edit documents in approval" />
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
