import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
import Container from '../src/components/Container';
import UserNav from '../src/components/UserNav';
import UserLoginForm from '../src/components/UserLoginForm';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft</title>
        <meta
          name="description"
          content="Wraft - The Document Automation Platform"
        />
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
