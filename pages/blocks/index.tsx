import { FC } from 'react';
import Head from 'next/head';
import BlockTemplateList from '../../src/components/BlockTemplateList';
import Page from '../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Blocks - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>        
        <BlockTemplateList />
      </Page>
    </>
  );
};

export default Index;
