import { FC } from 'react';
import Head from 'next/head';

import PipelineLogDetail from 'components/Pipeline/PipelineLogDetail';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const PipelineLogDetailPage: FC = () => {
  return (
    <>
      <Head>
        <title>Pipeline Log Details | Wraft</title>
        <meta name="description" content="View pipeline log details" />
      </Head>
      <Page>
        <PageHeader title="Pipeline Log Details" hasBack={true} />
        <PipelineLogDetail />
      </Page>
    </>
  );
};

export default PipelineLogDetailPage;
