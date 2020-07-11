import React from 'react';
import Head from 'next/head';
// import ContentTypeForm from '../../src/components/ContentTypeForm';

import Page from '../../../src/components/Page';
import { Flex } from 'rebass';
import { useRouter } from 'next/router';
import CreateForm from '../../../src/components/ContentForm';

export const Index = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Instance - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <Flex>
          <CreateForm id={router.query.id} edit={true} />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
