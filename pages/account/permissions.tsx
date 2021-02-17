import React from 'react';
import Head from 'next/head';
import Page from '../../src/components/Page';
import { Flex, Text } from 'theme-ui';
import OrgSidebar from '../../src/components/OrgSidebar';

export const CompanyForm = () => {
  return (
    <>
      <Head>
        <title>Manage Roles/Permissions | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <Flex>
          <OrgSidebar/>
          <Text variant="pagetitle">Permission</Text>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
