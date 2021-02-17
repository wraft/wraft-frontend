import React from 'react';
import Head from 'next/head';
import Page from '../../src/components/Page';
import { Flex } from 'theme-ui';
import OrgPermissionList from '../../src/components/OrgPermissionList';
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
          <OrgPermissionList/>          
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
