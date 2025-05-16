import { FC } from 'react';
import Head from 'next/head';

import VariantList from 'components/Variants/VariantList';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Structures | Wraft</title>
        <meta name="description" content="wraft variants" />
      </Head>
      <Page>
        <VariantList />
      </Page>
    </>
  );
};

export default Index;
