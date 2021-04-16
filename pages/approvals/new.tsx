import { FC } from 'react';
import Head from 'next/head';
import ApprovalForm from '../../src/components/ApprovalForm';
import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/approvals">
            <a>Back</a>
          </Link>
          <ApprovalForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
