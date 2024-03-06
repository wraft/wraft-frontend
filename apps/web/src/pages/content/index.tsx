import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex, Box, Text } from 'theme-ui';

import ContentTypeList from 'components/ContentTypeList';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        x
        <Flex>
          <Link href="/content-types/new">New Content Type</Link>
          <ContentTypeList />
          <Box>
            <Text>Dashboard</Text>
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default Index;
