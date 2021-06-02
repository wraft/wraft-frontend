import { FC } from 'react';
import Head from 'next/head';
import { Flex, Box } from 'theme-ui';

import ProfileForm from '../../src/components/ProfileForm';
import Page from '../../src/components/PageFrame';
import OrgSidebar from '../../src/components/OrgSidebar';
import PageHeader from '../../src/components/PageHeader';
import Link from '../../src/components/NavLink';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="My Account">
          <Box sx={{ ml: 'auto' }}/>
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
