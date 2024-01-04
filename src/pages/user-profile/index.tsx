import { FC } from 'react';

import Head from 'next/head';
import { Box } from 'theme-ui';

// import Router from 'next/router'
import Container from '../../components/Container';
import UserNav from '../../components/UserNav';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>List of Grocery List</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Box>
        <Container width={100} bg={''}>
          <UserNav />
        </Container>
      </Box>

      {/* <button onClick={() => Router.push('/meal-planner/review')}>Meal review</button> */}
    </>
  );
};

export default Index;
