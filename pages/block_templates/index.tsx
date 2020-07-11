import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';
// import Link from 'next/link';

import TemplateList from '../../src/components/BlockTemplateList'
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
          <TemplateList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
