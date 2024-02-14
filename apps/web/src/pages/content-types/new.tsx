import { FC } from 'react';
import Head from 'next/head';

import ContentTypeForm from '../../components/ContentTypeForm';
import Page from '../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <ContentTypeForm />
      </Page>
    </>
  );
};

export default Index;
