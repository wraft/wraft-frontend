import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';
import { ErrorBoundary } from '@wraft/ui';

import Page from 'components/BlankFrame';
import BlockTemplateForm from 'components/BlockTemplateForm';
import NavEdit from 'components/NavEdit';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Block | Wraft</title>
        <meta name="description" content="edit block" />
      </Head>
      <Page>
        <NavEdit navtitle="Edit Block" />
        <Container sx={{ maxWidth: '90ch', mx: 'auto' }}>
          <ErrorBoundary>
            <BlockTemplateForm />
          </ErrorBoundary>
        </Container>
      </Page>
    </>
  );
};

export default Index;
