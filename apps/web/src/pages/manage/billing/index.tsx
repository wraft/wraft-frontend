import { FC } from 'react';
import Head from 'next/head';
import { backOut } from 'framer-motion';
import PlanTemplateList from 'pages/manage/billing/plan';

import Page from 'components/PageFrame';

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
