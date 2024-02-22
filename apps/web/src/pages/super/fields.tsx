import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';

const VenderPage: FC = () => {
  return (
    <>
      <Head>
        <title>Super Admin</title>
      </Head>
      <Page>
        <h1>Organization Fields</h1>
      </Page>
    </>
  );
};

export default VenderPage;
