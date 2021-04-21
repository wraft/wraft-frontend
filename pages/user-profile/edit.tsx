import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
// import Router from 'next/router'
import Container from '../../src/components/Container';
import ProfileBasicForm from '../../src/components/ProfileBasicForm';
import UserNav from '../../src/components/UserNav';

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
          <Container width={70} bg={''}>
            <ProfileBasicForm />
          </Container>
        </Container>
      </Box>

      {/* <button onClick={() => Router.push('/meal-planner/review')}>Meal review</button> */}
    </>
  );
};

export default Index;
