import { FC } from 'react';
import Head from 'next/head';
import UserList from '../../src/components/UserList';
import Page from '../../src/components/PageFrame';

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
