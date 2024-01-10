import { FC } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import ApprovalForm from '../../components/ApprovalForm';
import Page from '../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/approvals">Back</Link>
          <ApprovalForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
