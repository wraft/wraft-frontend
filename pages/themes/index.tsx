import { FC } from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';
import ThemeList from '../../src/components/ThemeList';
import Page from '../../src/components/Page';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <ThemeList />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
