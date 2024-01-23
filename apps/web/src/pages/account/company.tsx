import { FC } from 'react';

import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import OrgForm from '../../components/OrgForm';
import OrgSidebar from '../../components/OrgSidebar';
import Page from '../../components/PageFrame';
import PageHeader from '../../components/PageHeader';
import { authorize } from '../../middleware/authorize';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <PageHeader title="Settings" desc="">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Container variant="layout.pageFrame">
          <Flex>
            <OrgSidebar />
            <Box sx={{ bg: 'white', width: '100%' }} p={4}>
              <Box sx={{ width: '526px' }}>
                <OrgForm />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default authorize(CompanyForm, 'organisation');
