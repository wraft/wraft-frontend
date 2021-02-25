import { FC } from 'react';
import Head from 'next/head';
import { Flex } from 'rebass';

// import CombinationList from '../../src/components/CombinationList'
import Page from '../../src/components/Page';
import PageHeader from '../../src/components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Meal Combinations</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex pt={3}>
          <PageHeader title="Blog" />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
