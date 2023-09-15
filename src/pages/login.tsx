import { FC } from 'react';
import Head from 'next/head';
// import Container from '../src/components/Container';
import UserLogin from '../components/userLogin';

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

      <UserLogin />
    </>
  );
};

export default Index;
