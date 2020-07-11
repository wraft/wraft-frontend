import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';
import Link from 'next/link';

import FlowList from '../../src/components/FlowList'
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
          <Link href="/flows/new">
            <a>New Flow</a>
          </Link>
          <FlowList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
