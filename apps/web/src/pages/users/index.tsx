import { FC } from 'react';

import Head from 'next/head';

import Page from '../../components/PageFrame';
import UserList from '../../components/UserList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Customers | Wraft Admin</title>
      </Head>
      <Page>
        <UserList />
      </Page>
    </>
  );
};

export default Index;
// export default withAuthSync(Index)
