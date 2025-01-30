import { FC } from 'react';
import Head from 'next/head';

import PipelineList from 'components/Pipeline/PipelineList';
import Page from 'common/PageFrame';

const PipelineIndex: FC = () => {
  return (
    <>
      <Head>
        <title>Pipelines | Wraft</title>
        <meta name="description" content="Manage Pipelines" />
      </Head>
      <Page>
        <PipelineList />
      </Page>
    </>
  );
};

export default PipelineIndex;
