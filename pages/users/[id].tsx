import React from 'react';
import Head from 'next/head';

import Page from '../../src/components/Page';
import UserDetail from '../../src/components/UserDetail';

export const Index = () => {
  return (
    <>
      <Head>
        <title>Create Meal Combinations</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <UserDetail/>
      </Page>
    </>
  );
};

export default Index;
// export default withAuthSync(Index)
