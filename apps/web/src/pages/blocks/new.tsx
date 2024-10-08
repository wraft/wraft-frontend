import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';

import Page from 'components/BlankFrame';
import BlockTemplateForm from 'components/BlockTemplateForm';
import NavEdit from 'components/NavEdit';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Block | Wraft</title>
        <meta name="description" content="create new block" />
      </Head>
      <Page>
        <NavEdit navtitle="Manage Blocks" backLink="/blocks" />
        <Container sx={{ maxWidth: '90ch', mx: 'auto' }}>
          <BlockTemplateForm />
        </Container>
      </Page>
    </>
  );
};

export default Index;
