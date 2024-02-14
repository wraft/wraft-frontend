import { FC } from 'react';
import Head from 'next/head';

import Page from '../../components/PageFrame';
import SuperAdmin from '../../components/SuperAdmin';

const VenderPage: FC = () => {
  return (
    <>
      <Head>
        <title>Super Admin</title>
      </Head>
      <Page>
        <SuperAdmin />
      </Page>
    </>
  );
};

export default VenderPage;
