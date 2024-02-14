import { FC } from 'react';
import Head from 'next/head';

import Page from '../../../components/PageFrame';
import PipelineList from '../../../components/PipelineList';

const PipelineIndex: FC = () => {
  return (
    <>
      <Head>
        <title>Pipelines - Wraft Docs</title>
        <meta name="description" content="Manage Pipelines" />
      </Head>
      <Page>
        <PipelineList />
      </Page>
    </>
  );
};

export default PipelineIndex;
