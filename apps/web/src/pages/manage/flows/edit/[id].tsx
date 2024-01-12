import { FC } from 'react';

import Head from 'next/head';

import FlowForm from '../../../../components/FlowForm';
import Page from '../../../../components/PageFrame';

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
