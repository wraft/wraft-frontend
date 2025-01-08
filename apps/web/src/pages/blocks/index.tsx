import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import BlockTemplateList from 'components/Block/BlockTemplateList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Blocks | Wraft</title>
        <meta name="description" content="wraft blocks" />
      </Head>
      <Page>
        <BlockTemplateList />
      </Page>
    </>
  );
};

export default Index;
