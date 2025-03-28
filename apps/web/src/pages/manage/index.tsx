import { FC } from 'react';
import Head from 'next/head';

import ManageSidebar from 'common/ManageView';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage - Wraft</title>
        <meta name="description" content="manage wraft" />
      </Head>
      <Page>
        <ManageSidebar />
      </Page>
    </>
  );
};

export default Index;
