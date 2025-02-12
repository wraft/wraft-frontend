import { FC, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Dashboard from 'components/Dashboard';
import Page from 'common/PageFrame';
import { useAuth } from 'contexts/AuthContext';

const Index: FC = () => {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  return (
    <>
      <Head>
        <title>Wraft | The Document Automation Platform</title>
        <meta
          name="description"
          content="Wraft is a document automation and pipelining tools for businesses"
        />
      </Head>
      {accessToken && (
        <Page>
          <Dashboard />
        </Page>
      )}
    </>
  );
};
export default Index;
