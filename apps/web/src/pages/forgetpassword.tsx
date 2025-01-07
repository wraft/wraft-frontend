import { FC } from 'react';
import Head from 'next/head';

import ForgetPasswordForm from 'components/Auth/ForgetPasswordForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Forget Password | Wraft</title>
        <meta
          name="description"
          content="Wraft - The Document Automation Platform"
        />
      </Head>

      <ForgetPasswordForm />
    </>
  );
};

export default Index;
