import { FC } from 'react';
import Head from 'next/head';

import ContentTypeList from '../../src/components/ContentTypeList';
import Page from '../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Variants - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ContentTypeList isEdit={true}/>
      </Page>
    </>
  );
};

export default Index;
