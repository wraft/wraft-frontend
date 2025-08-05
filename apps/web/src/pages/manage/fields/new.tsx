import { FC } from 'react';
import Head from 'next/head';
// import { Box, Container } from 'theme-ui';
import { Box } from '@wraft/ui';

import Page from 'common/PageFrame';
import FieldTypeForm from 'common/FieldTypeForm';
import PageHeader from 'common/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Field Type | Wraft </title>
        <meta name="description" content="create new fields" />
      </Head>
      <Page>
        <PageHeader title="Create Field Type" />
        <Box variant="layout.contentFrame">
          <FieldTypeForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
