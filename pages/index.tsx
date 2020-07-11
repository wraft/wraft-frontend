import React from 'react';
import Head from 'next/head';
import { Text, Box } from 'rebass';
import Page from '../src/components/Page';
import { useStoreState } from 'easy-peasy';

import UserNav from '../src/components/UserNav';
import UserHome from '../src/components/UserHome';

export const Index = () => {
  const token = useStoreState(state => state.auth.token);
  console.log(token);
  return (
    <>
      <Head>
        <title>Dieture - The Best Diet Center Qatar, Weight Loss Clinic, Dietician in Doha</title>
        <meta
          name="description"
          content="Dieture – Best diet center in Qatar helps you lose weight healthily with balanced diet plan; the healthy diet menu includes classic menu, keto menu, athlete menu, ramadan menu catered by W hotel."
        />
      </Head>
      {!token && (
        <Box>
          <UserNav />
          <UserHome />
        </Box>
      )}
      {token && (
        <Page>
          <Box pb={5} pt={5}>
            <Text variant="pagetitle" pb={0} mb={2}>Welcome to Wraft Docs</Text>
            <Text fontSize={2} sx={{ color: '#999', pt: 0 }}>
              Select a template to begin with
            </Text>
          </Box>
        </Page>
      )}
    </>
  );
};

export default Index;
