import React from 'react';
import Head from 'next/head';
// import ContentTypeForm from '../../src/components/ContentTypeForm';

import PageFull from '../../src/components/PageFull';
import { useRouter } from 'next/router';
import CreateForm from '../../src/components/ContentForm';

export const Index = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Instance - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <PageFull id="Modal" showFull={true}>
        <CreateForm id={router.query.id} />
      </PageFull>
    </>
  );
};

export default Index;
