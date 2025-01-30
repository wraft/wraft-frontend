import { FC } from 'react';
import Head from 'next/head';

import VendorList from 'components/Vendor/VendorList';
import Page from 'common/PageFrame';

const VenderPage: FC = () => {
  return (
    <>
      <Head>
        <title>Vendors - Wraft</title>
      </Head>
      <Page>
        <VendorList />
      </Page>
    </>
  );
};

export default VenderPage;
