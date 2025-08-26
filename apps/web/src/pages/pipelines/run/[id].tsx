import { FC } from 'react';
import Head from 'next/head';

import PipelineDetail from 'components/Pipeline/PipelineDetail';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Run Pipeline | Wraft</title>
        <meta name="description" content="run wraft pipeline" />
      </Head>
      <Page>
        <PipelineDetail />
      </Page>
    </>
  );
};

export default Index;
