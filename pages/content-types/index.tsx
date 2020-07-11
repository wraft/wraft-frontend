import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';

import ContentTypeList from '../../src/components/ContentTypeList'
import Page from '../../src/components/Page';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>          
          <ContentTypeList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
