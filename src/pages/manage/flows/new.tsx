import { FC } from 'react';
import Head from 'next/head';
import FlowForm from '../../../components/FlowForm';

import Page from '../../../components/PageFrame';
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
          <Link href="/manage/flows">Back</Link>
          <FlowForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
