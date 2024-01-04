import { FC } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import FieldTypeForm from '../../../components/FieldTypeForm';
import Page from '../../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Field Type - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/fields">Back</Link>
          <FieldTypeForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
