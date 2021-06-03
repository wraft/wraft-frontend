import { FC } from 'react';
import Head from 'next/head';
import PipelineForm from '../../../../src/components/PipelineForm';
import Page from '../../../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PipelineForm />
      </Page>
    </>
  );
};

export default Index;
