import React from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';
import Link from 'next/link';

import TemplateList from '../../src/components/TemplateList'
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
          <Link href="/templates/new">
            <a>New Template</a>
          </Link>
          <TemplateList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
