import { FC } from 'react';
import Head from 'next/head';

import ContentTypeList from 'components/ContentTypeList';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Variants - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ContentTypeList />
      </Page>
    </>
  );
};

export default Index;
