import React from 'react';
import Head from 'next/head';
import ProfileForm from '../../src/components/OrgForm';
import Page from '../../src/components/Page';
import { Box, Flex } from 'theme-ui';
import Link from 'next/link';
import OrgSidebar from '../../src/components/OrgSidebar';

export const CompanyForm = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <Flex>
          <Box sx={{ width: '25%', px: 4, py: 5}}>
            <OrgSidebar />
            <Link href="/account/members">
              <a>Members</a>
            </Link>
          </Box>
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
