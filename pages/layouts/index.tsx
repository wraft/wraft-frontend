import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
import Link from 'next/link';

import LayoutList from '../../src/components/LayoutList';
import Page from '../../src/components/Page';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <Link href="/layouts/new">
            <a>Create New Layout</a>
          </Link>
        </Box>
        <Box>
          <LayoutList />
        </Box>
      </Page>
    </>
  );
};

export default Index;
