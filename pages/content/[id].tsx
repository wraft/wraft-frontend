import React from 'react';
import Head from 'next/head';
import ContentDetail from '../../src/components/ContentDetail';

import Page from '../../src/components/Page';
import { Flex } from 'rebass';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <ContentDetail />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
