import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import ProfileForm from 'components/User/ProfileForm';
import OrgSidebar from 'common/OrgSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft</title>
        <meta name="description" content="my wraft account" />
      </Head>
      <Page>
        <PageHeader title="Settings" />
        <Container variant="layout.pageFrame">
          <Flex>
            <OrgSidebar />
            <Box sx={{ bg: 'white', width: '100%' }} pl={4} pt={4}>
              <ProfileForm />
            </Box>
          </Flex>
        </Container>
      </Page>
      {/* <Page>
        <Flex>
          <ProfileForm />
        </Flex>
      </Page> */}
    </>
  );
};

export default Contents;
