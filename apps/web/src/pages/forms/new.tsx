import { FC } from 'react';
import Head from 'next/head';

import CollectionForm from 'components/CollectionForm';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Collection Form | Wraft</title>
        <meta name="description" content="create wraft form" />
      </Head>
      <Page id="Modal" showFull={true}>
        <CollectionForm />
      </Page>
    </>
  );
};

export default Index;
