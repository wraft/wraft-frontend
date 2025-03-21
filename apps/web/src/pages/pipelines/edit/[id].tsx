import { FC } from 'react';
import Head from 'next/head';

import PipelineForm from 'components/Pipeline/PipelineForm';
import Page from 'common/PageFrame';

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
