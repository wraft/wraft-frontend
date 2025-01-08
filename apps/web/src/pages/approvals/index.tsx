import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import ApprovalList from 'components/Approval/ApprovalList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Approvals | Wraft</title>
        <meta name="description" content="pending document approval" />
      </Head>
      <Page>
        <ApprovalList />
      </Page>
    </>
  );
};

export default Index;
