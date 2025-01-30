import { FC } from 'react';
import Head from 'next/head';

import FormEntry from 'components/Form/FormEntry';
import Page from 'common/PageFrame';

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
