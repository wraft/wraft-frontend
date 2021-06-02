import { FC } from 'react';
import Head from 'next/head';
import FlowForm from '../../../src/components/FlowForm';

import Page from '../../../src/components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

const Index: FC = () => {
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
