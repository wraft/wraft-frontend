import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';

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
        <Container sx={{ maxWidth: '90ch', mx: 'auto' }}>
          <BlockTemplateForm />
        </Container>
      </Page>
    </>
  );
};

export default Index;
