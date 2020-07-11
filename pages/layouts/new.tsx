import React from 'react';
import Head from 'next/head';
import LayoutForm from '../../src/components/LayoutForm';
import Page from '../../src/components/Page';
import { Box } from 'rebass';
import Link from 'next/link';

export const Index = () => {
  return (
    <>
      <Head>
        <title>New Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box width={1}>
          <Link href="/layouts">
            <a>Back</a>
          </Link>
          <LayoutForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
