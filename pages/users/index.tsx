import React from 'react';
import Head from 'next/head';

import UserList from '../../src/components/UserList'
import Page from '../../src/components/Page';

export const Index = () => {
  
  return (
    <>
      <Head>
        <title>Customers | Dieture Admin</title>
      </Head>
      <Page>
          <UserList/>
      </Page>
    </>
  );
};

export default Index;
// export default withAuthSync(Index)
