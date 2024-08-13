import { FC } from 'react';
import Head from 'next/head';
import { Box, Container } from 'theme-ui';

import FieldTypeForm from 'components/FieldTypeForm';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Field Type | Wraft </title>
        <meta name="description" content="create new fields" />
      </Head>
      <Page>
        <PageHeader title="Create Field Type" />
        <Container variant="layout.pageFrame">
          <Box variant="layout.contentFrame">
            <FieldTypeForm />
          </Box>
        </Container>
      </Page>
    </>
  );
};

export default Index;
