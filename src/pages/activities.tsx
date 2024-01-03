import { FC } from 'react';
import Head from 'next/head';
import { Text, Box, Flex, Container } from 'theme-ui';
import Page from '../components/PageFrame';
import UserNav from '../components/UserNav';
import UserHome from '../components/UserHome';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../contexts/AuthContext';

const Index: FC = () => {
  const { accessToken } = useAuth();
  return (
    <>
      <Head>
        <title>Wraft - The Document Automation Platform</title>
        <meta
          name="description"
          content="Wraft is a document automation and pipelining tools for businesses"
        />
      </Head>
      {!accessToken && (
        <Box>
          <UserNav />
          <UserHome />
        </Box>
      )}
      {accessToken && (
        <Page>
          <Container variant="layout.pageFrame">
            <Flex sx={{ width: '100%' }}>
              <Box sx={{ pb: 4, width: '45%', pl: 4 }}>
                <Box sx={{ py: 3, color: 'gray.5', fontSize: 1 }}>
                  <Text color="gray.7">Activities</Text>
                </Box>
                <ActivityFeed />
              </Box>
            </Flex>
          </Container>
        </Page>
      )}
    </>
  );
};

export default Index;
