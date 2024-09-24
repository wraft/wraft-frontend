import { FC } from 'react';
import Head from 'next/head';
import { Flex, Box, Container } from 'theme-ui';

import OrgSidebar from 'components/OrgSidebar';
import Page from 'components/PageFrame';
import ProfileForm from 'components/ProfileForm';
import PageHeader from 'common/PageHeader';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft</title>
        <meta name="description" content="my wraft account" />
      </Head>
      <Page>
        <PageHeader title="My Account" desc="Manage your account">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Container variant="layout.pageFrame">
          <Flex>
            <OrgSidebar />
            <Box sx={{ bg: 'white', width: '100%' }} pl={4} pt={4}>
              <ProfileForm />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Contents;
