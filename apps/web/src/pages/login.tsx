import { FC } from 'react';
import Head from 'next/head';

import LoginForm from 'components/Auth/LoginForm';

export const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Login | Wraft</title>
        <meta
          name="description"
          content="Wraft - The Document Automation Platform"
        />
      </Head>

      <LoginForm />
    </>
  );
};

export default Index;
