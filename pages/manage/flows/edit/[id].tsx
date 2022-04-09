import { FC } from 'react';
import Head from 'next/head';
import FlowForm from '../../../../src/components/FlowForm';
import Page from '../../../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Flow - Wraft Docs</title>
      </Head>
      <Page>
        <FlowForm />
      </Page>
    </>
  );
};

export default Index;
