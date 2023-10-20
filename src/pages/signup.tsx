import { FC } from 'react';
import Head from 'next/head';

import SignupForm from '../components/SignupForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Signup - Wraft</title>
        <meta
          name="description"
          content="Wraft - The Document Automation Platform"
        />
      </Head>

      <SignupForm />
    </>
  );
};

export default Index;
