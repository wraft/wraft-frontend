import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import FormEntryDetails from 'components/FormEntryDetails';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Form Response Details | Wraft</title>
        <meta name="description" content="form response details" />
      </Head>
      <Page>
        <FormEntryDetails />
      </Page>
    </>
  );
};

export default Index;
