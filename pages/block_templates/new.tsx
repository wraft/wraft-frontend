import React from 'react';
import Head from 'next/head';
import BlockTemplateForm from '../../src/components/BlockTemplateForm';

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
          <Link href="/block_templates">
            <a>Back</a>
          </Link>
          <BlockTemplateForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
