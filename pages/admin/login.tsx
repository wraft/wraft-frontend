import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
import Container from '../../src/components/Container';
import Nav from '../../src/components/Nav';
import LoginForm from '../../src/components/LoginForm';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Box>
        <Container width={100} bg={''}>
          <Nav />
        </Container>
      </Box>
      <Container width={60} bg={''}>
        <LoginForm />
      </Container>
    </>
  );
};

export default Index;
