import { FC } from 'react';
import Head from 'next/head';

import BlockTemplateList from 'components/Block/BlockTemplateList';
import Page from 'common/PageFrame';

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
