import { FC } from 'react';
import Head from 'next/head';
import ApprovalList from '../../src/components/ApprovalList';
import Page from '../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Approvals [All] - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ApprovalList />
      </Page>
    </>
  );
};

export default Index;
