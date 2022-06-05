import { FC } from 'react';
import Head from 'next/head';
import SuperAdmin from '../../components/SuperAdmin';
import Page from '../../components/PageFrame';

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
