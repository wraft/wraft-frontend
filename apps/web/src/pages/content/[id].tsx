import { FC } from 'react';
import Head from 'next/head';

import ContentDetail from '../../components/ContentDetail';
import Page from '../../components/PageFrameInner';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ContentDetail />
      </Page>
    </>
  );
};

export default Index;
