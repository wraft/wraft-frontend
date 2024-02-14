import { FC } from 'react';
import Head from 'next/head';

import Page from '../../../../components/PageFrame';
import PipelineForm from '../../../../components/PipelineForm';

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
