import { FC } from 'react';
import Head from 'next/head';
import VendorForm from '../../components/VendorForm';
import Page from '../../components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Vendor - Wraft Docs</title>
      </Head>
      <Page>
        <Flex>
          <Link href="/vendors">
            <a>Back</a>
          </Link>
          <VendorForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
