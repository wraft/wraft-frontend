import { FC } from 'react';
import Head from 'next/head';
import CollectionForm from '../../components/CollectionForm';
import Page from '../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Collection Form - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <CollectionForm />
      </Page>
    </>
  );
};

export default Index;
