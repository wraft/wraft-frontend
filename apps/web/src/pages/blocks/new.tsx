import { FC } from 'react';
import Head from 'next/head';
import { Box } from '@wraft/ui';

import BlockTemplateForm from 'components/Block/BlockTemplateForm';
import Page from 'components/Block/BlankFrame';
import NavEdit from 'common/NavEdit';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Block | Wraft</title>
        <meta name="description" content="create new block" />
      </Head>
      <Page>
        <NavEdit navtitle="Manage Blocks" backLink="/blocks" />
        <Box maxWidth="90ch" mx="auto">
          <BlockTemplateForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
