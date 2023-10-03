import { FC } from 'react';
import Head from 'next/head';

import SignupForm from '../components/SignupForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>

      <SignupForm />
    </>
  );
};

export default Index;
