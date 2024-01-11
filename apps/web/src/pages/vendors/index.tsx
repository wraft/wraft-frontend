import { FC } from 'react';

import Head from 'next/head';

import Page from '../../components/PageFrame';
import VendorList from '../../components/VendorList';

const VenderPage: FC = () => {
  return (
    <>
      <Head>
        <title>Vendors - Wraft Docs</title>
      </Head>
      <Page>
        <VendorList />
      </Page>
    </>
  );
};

export default VenderPage;
