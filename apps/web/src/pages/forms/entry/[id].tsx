import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import FormEntry from 'components/FormEntry';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Form Entry | Wraft</title>
        <meta name="description" content="form entry" />
      </Head>
      <Page>
        <FormEntry />
      </Page>
    </>
  );
};

export default Index;
