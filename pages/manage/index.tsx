import { FC } from 'react';
import Head from 'next/head';
import ManageSidebar from '../../src/components/ManageView';
import Page from '../../src/components/PageFrame';
const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ManageSidebar showFull={true} />
      </Page>
    </>
  );
};

export default Index;
