import { FC } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import BlockTemplateForm from '../../components/BlockTemplateForm';
import Page from '../../components/PageFrame';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/blocks">Back</Link>
          <BlockTemplateForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
