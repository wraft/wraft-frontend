import React from 'react';
import Head from 'next/head';
import OrgMemberForm from '../../src/components/OrgMemberForm';
import Page from '../../src/components/Page';
import { Flex } from 'theme-ui';
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
          <OrgSidebar/>
          <OrgMemberForm />          
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
