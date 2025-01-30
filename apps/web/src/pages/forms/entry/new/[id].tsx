import { FC } from 'react';
import Head from 'next/head';

import FormEntry from 'components/Form/FormEntry';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Form Entry | Wraft</title>
        <meta name="description" content="form entry" />
      </Head>
      <FormEntry />
    </>
  );
};

export default Index;
