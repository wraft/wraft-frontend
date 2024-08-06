import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import FormEntryDetails from 'components/FormEntryDetails';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <FormEntryDetails />
      </Page>
    </>
  );
};

export default Index;
