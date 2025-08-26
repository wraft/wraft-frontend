import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex } from '@wraft/ui';

import ApprovalForm from 'components/Approval/ApprovalForm';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Approval - Wraft</title>
        <meta
          name="description"
          content="Set up custom approval processes with Wraft."
        />
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
