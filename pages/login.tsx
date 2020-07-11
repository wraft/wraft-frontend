import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
import Container from '../src/components/Container';
import UserNav from '../src/components/UserNav';
import UserLoginForm from '../src/components/UserLoginForm';


export const Index = () => {
  return (
    <>
      <Head>
        <title>Login - Dieture</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Box>
        <Container width={100} bg={''}>
          <UserNav />
        </Container>
      </Box>
      <Container width={60} bg={''}>
        <UserLoginForm />
      </Container>
    </>
  );
};

export default Index;
