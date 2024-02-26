import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import OrgSidebar from 'components/OrgSidebar';
import PageHeader from 'components/PageHeader';
import Page from 'components/PageFrame';
import ProfileForm from 'components/ProfileForm';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Contens | Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
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
