import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import Container from '../components/Container';
import Nav from '../components/Nav';
import SignupForm from '../components/SignupForm';

const Index: FC = () => {
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
        <SignupForm />
      </Container>
    </>
  );
};

export default Index;
