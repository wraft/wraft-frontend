import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../src/components/TemplateForm';

import Page from '../../src/components/Page';
import { Flex } from 'rebass';
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
          <Link href="/templates">
            <a>Back</a>
          </Link>
          <TemplateForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
