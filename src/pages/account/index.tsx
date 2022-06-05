import { FC } from 'react';
import Head from 'next/head';
import { Flex, Box } from 'theme-ui';

import ProfileForm from '../../components/ProfileForm';
import Page from '../../components/PageFrame';
import OrgSidebar from '../../components/OrgSidebar';
import PageHeader from '../../components/PageHeader';

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
        <Flex>
          <OrgSidebar />
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
