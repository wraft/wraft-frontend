import React from 'react';
import Head from 'next/head';
import FlowForm from '../../src/components/FlowForm';

import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/flows">
            <a>Back</a>
          </Link>
          <FlowForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
