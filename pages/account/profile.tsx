import React from 'react';
import Head from 'next/head';
import ProfileForm from '../../src/components/ProfileForm';
import Page from '../../src/components/Page';
import { Flex } from 'rebass';
import Link from 'next/link';

export const Contents = () => {
  return (
    <>
      <Head>
        <title>Contens | Dieture</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
      <Flex>
          <Link href="/account">
            <a>Back to Profile</a>
          </Link>
        </Flex>
        <Flex>                   
          <ProfileForm/>
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
