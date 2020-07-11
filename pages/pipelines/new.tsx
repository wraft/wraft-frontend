import React from 'react';
import Head from 'next/head';
import Theme from '../../src/components/PipelineForm';

import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Create Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/pipelines">
            <a>Back</a>
          </Link>
          <Theme />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
