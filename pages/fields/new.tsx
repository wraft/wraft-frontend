import React from 'react';
import Head from 'next/head';
import FieldTypeForm from '../../src/components/FieldTypeForm';

import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Create Field Type - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/fields">
            <a>Back</a>
          </Link>
          <FieldTypeForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
