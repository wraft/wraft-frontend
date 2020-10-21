import React from 'react';
import Head from 'next/head';
import ProfileForm from '../../src/components/OrgMemberForm';
import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

export const CompanyForm = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
      <Flex>
          <Link href="/account">
            <a>Back to company</a>
          </Link>
        </Flex>
        <Flex>         
        <Link href="/account/members">
            <a>Members</a>
          </Link>          
          <ProfileForm/>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
