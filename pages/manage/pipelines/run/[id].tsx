import { FC } from 'react';
import Head from 'next/head';
import PipelineView from '../../../../src/components/PipelineView';
import Page from '../../../../src/components/Page';
import { Box } from 'theme-ui';
// import BulkBuild from '../../../src/components/BulkBuild';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Run Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <PipelineView />
          {/* <BulkBuild master="" master_id=""/> */}
        </Box>
      </Page>
    </>
  );
};

export default Index;
