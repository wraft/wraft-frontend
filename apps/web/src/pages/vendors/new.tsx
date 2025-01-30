import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import VendorForm from 'components/Vendor/VendorForm';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Vendor - Wraft</title>
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
