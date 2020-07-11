import React from 'react';
import Head from 'next/head';
import ContentListAll from '../src/components/ContentList';
import Page from '../src/components/Page';
import { Flex } from 'theme-ui';

export const Contents = () => {
  return (
    <>
      <Head>
        <title>Contens | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>          
          <ContentListAll />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
