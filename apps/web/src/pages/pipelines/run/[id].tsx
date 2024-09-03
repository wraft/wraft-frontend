import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import PipelineViewNew from 'components/Pipeline/PipelineViewNew';
// import { Box } from 'theme-ui';
// import BulkBuild from '../../../src/components/Bu';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Run Pipeline | Wraft</title>
        <meta name="description" content="run wraft pipeline" />
      </Head>
      <Page>
        {/* <Box> */}
        <PipelineViewNew />
        {/* <BulkBuild master="" master_id=""/> */}
        {/* </Box> */}
      </Page>
    </>
  );
};

export default Index;
