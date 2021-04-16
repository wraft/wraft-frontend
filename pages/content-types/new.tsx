import { FC } from 'react';
import Head from 'next/head';
import ContentTypeForm from '../../src/components/ContentTypeForm';

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
      <Page id="Modal" showFull={true}>
        <Flex>
          <Link href="/content-types">
            <a>Back</a>
          </Link>
          <ContentTypeForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
