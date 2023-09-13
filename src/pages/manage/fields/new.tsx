import { FC } from 'react';
import Head from 'next/head';
import FieldTypeForm from '../../../components/FieldTypeForm';
import Page from '../../../components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

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
