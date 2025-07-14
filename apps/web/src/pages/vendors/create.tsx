import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';

import VendorForm from 'components/Vendor/VendorForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const CreateVendorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Vendor | Wraft</title>
        <meta name="description" content="Create a new vendor" />
      </Head>
      <Page>
        <PageHeader
          title="Create Vendor"
          desc="Add a new vendor to your system"
        />
        <VendorForm />
      </Page>
    </>
  );
};

export default CreateVendorPage;
