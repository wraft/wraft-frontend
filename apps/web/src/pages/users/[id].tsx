import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import UserDetail from 'components/UserDetail';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Meal Combinations</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <UserDetail />
      </Page>
    </>
  );
};

export default Index;
// export default withAuthSync(Index)
