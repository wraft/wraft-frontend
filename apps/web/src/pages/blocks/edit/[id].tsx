import { FC } from 'react';
import Head from 'next/head';
import { Box, ErrorBoundary } from '@wraft/ui';

import BlockTemplateForm from 'components/Block/BlockTemplateForm';
import { Page } from 'components/Block/BlankFrame';
import NavEdit from 'common/NavEdit';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Block | Wraft</title>
        <meta name="description" content="edit block" />
      </Head>
      <Page>
        <NavEdit navtitle="Edit Block" />
        <Box mx="auto" my="lg" maxWidth="90ch">
          <ErrorBoundary>
            <BlockTemplateForm />
          </ErrorBoundary>
        </Box>
      </Page>
    </>
  );
};

export default Index;
