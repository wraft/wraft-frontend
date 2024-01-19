import { FC } from 'react';

import Head from 'next/head';
import { Flex, Box, Container } from 'theme-ui';

import OrgSidebar from '../../components/OrgSidebar';
import Page from '../../components/PageFrame';
import PageHeader from '../../components/PageHeader';
import ProfileForm from '../../components/ProfileForm';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="My Account" desc="Manage your account">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Container variant="layout.pageFrame">
          <Flex>
            <OrgSidebar />
            <ProfileForm />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Contents;
