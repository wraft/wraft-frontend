import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
// import Container from '../src/components/Container';
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
      <Box bg='gray.0'>
        {/* <Container bg='red' width={100}> */}
          <UserNav />
          <UserLoginForm />
        {/* </Container> */}
      </Box>
      {/* <Container bg='green' width={60}> */}
        
      {/* </Container> */}
    </>
  );
};

export default Index;
