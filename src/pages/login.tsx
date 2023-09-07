import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
// import Container from '../src/components/Container';
import UserNav from '../components/UserNav';
import UserLoginForm from '../components/UserLoginForm';

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
        <UserNav />
        <UserLoginForm />
      </Box>
    </>
  );
};

export default Index;
