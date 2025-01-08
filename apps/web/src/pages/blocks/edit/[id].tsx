import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';
import { ErrorBoundary } from '@wraft/ui';

import NavEdit from 'components/NavEdit';
import BlockTemplateForm from 'components/Block/BlockTemplateForm';
import { Page } from 'components/Block/BlankFrame';

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
