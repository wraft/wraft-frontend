import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import VariantList from 'components/Variants/VariantList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Variants | Wraft</title>
        <meta name="description" content="wraft variants" />
      </Head>
      <Page>
        <VariantList />
      </Page>
    </>
  );
};

export default Index;
