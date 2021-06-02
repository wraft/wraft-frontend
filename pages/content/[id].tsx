import { FC } from 'react';
import Head from 'next/head';
import ContentDetail from '../../src/components/ContentDetail';

import Page from '../../src/components/BlankFrame';
import Nav from '../../src/components/NavEdit';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Nav/>
        <ContentDetail />
      </Page>
    </>
  );
};

export default Index;
