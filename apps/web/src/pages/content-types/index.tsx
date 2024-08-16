import { FC } from 'react';
import Head from 'next/head';

import ContentTypeList from 'components/ContentTypeList';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Variants | Wraft</title>
        <meta name="description" content="wraft variants" />
      </Head>
      <Page>
        <ContentTypeList />
      </Page>
    </>
  );
};

export default Index;
