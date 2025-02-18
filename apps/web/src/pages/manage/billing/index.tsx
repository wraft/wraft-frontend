import { FC } from 'react';
import Head from 'next/head';

import PlanTemplateList from 'components/Billing/plan';
import { Page } from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Plans | Wraft</title>
        <meta name="description" content="wraft blocks" />
      </Head>
      <Page>
        <PlanTemplateList />
      </Page>
    </>
  );
};

export default Index;
