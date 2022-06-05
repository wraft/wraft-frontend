import { FC } from 'react';
import Head from 'next/head';
import VendorList from '../../components/VendorList';
import Page from '../../components/PageFrame';

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
