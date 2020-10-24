import React from 'react';
import Head from 'next/head';
import ProfileForm from '../../src/components/OrgMemberForm';
import Page from '../../src/components/Page';
import { Flex, Box, Text } from 'theme-ui';
import Link from 'next/link';
import NavLink from '../../src/components/NavLink'

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
        <Box variant="w33">
            <Text sx={{ fontWeight: 'heading', mb: 1 }}>My Profile</Text>
            <NavLink href={'/account/company'}>
              <Text sx={{ fontWeight: 'body', mb: 1 }}>Manage Company</Text>
            </NavLink>
            <NavLink href={'/account/members'}>
              <Text sx={{ fontWeight: 'body', mb: 1 }}>Members</Text>
            </NavLink>
            <Text sx={{ fontWeight: 'body', mb: 1 }}>Notifications</Text>
            <Text sx={{ fontWeight: 'body', mb: 1 }}>Settings</Text>
          </Box>
          <Link href="/account/members">
            <a>Members</a>
          </Link>
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
