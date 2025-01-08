import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import Page from 'components/PageFrame';
import ApprovalForm from 'components/Approval/ApprovalForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Theme - Wraft</title>
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
