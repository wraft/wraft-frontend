import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';

import ApprovalList from '../../src/components/ApprovalList'
import Page from '../../src/components/Page';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>          
          <ApprovalList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
