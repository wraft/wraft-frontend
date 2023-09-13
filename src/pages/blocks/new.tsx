import { FC } from 'react';
import Head from 'next/head';
import BlockTemplateForm from '../../components/BlockTemplateForm';

import Page from '../../components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Content Types - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/block_templates">Back</Link>
          <BlockTemplateForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
