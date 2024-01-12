import { FC } from 'react';

import Head from 'next/head';
import { Flex, Box } from 'theme-ui';

import OrgSidebar from '../../components/OrgSidebar';
import Page from '../../components/PageFrame';
import PageHeader from '../../components/PageHeader';
import ProfileForm from '../../components/ProfileForm';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="My Account" desc="Manage your account">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex sx={{ px: 4 }}>
          <OrgSidebar />
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
