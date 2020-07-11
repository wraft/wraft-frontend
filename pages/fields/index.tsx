import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';

import FieldList from '../../src/components/FieldList'
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
          <FieldList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
