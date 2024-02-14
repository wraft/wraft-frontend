import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import Page from '../../components/PageFrame';
import VendorForm from '../../components/VendorForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Vendor - Wraft Docs</title>
      </Head>
      <Page>
        <Flex>
          <Link href="/vendors">Back</Link>
          <VendorForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
