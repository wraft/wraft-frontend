import { FC } from 'react';
import Head from 'next/head';

import PipelineViewNew from 'components/Pipeline/PipelineViewNew';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Run Pipeline | Wraft</title>
        <meta name="description" content="run wraft pipeline" />
      </Head>
      <Page>
        <PipelineViewNew />
      </Page>
    </>
  );
};

export default Index;
