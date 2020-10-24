import React from 'react';
import Head from 'next/head';
import ProfileForm from '../../src/components/ProfileForm';
import Page from '../../src/components/Page';
import { Flex } from 'theme-ui';
import OrgSidebar from '../../src/components/OrgSidebar';

export const Contents = () => {
  return (
    <>
      <Head>
        <title>Contens | Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <OrgSidebar/>
          <ProfileForm />          
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
