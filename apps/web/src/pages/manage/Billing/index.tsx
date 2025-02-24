import { FC } from 'react';
import Head from 'next/head';

import PlanList from 'components/Billing/planList';
import { Page } from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Plans | Wraft</title>
        <meta name="description" content="wraft blocks" />
      </Head>
      <Page>
        <PlanList />
      </Page>
    </>
  );
};

export default Index;
