import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import PipelineForm from 'components/PipelineForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Pipeline | Wraft</title>
        <meta name="description" content="edit pipeline" />
      </Head>
      <Page>
        <PipelineForm />
      </Page>
    </>
  );
};

export default Index;
