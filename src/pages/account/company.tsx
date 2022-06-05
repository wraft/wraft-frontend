import { FC } from 'react';
import Head from 'next/head';
import OrgForm from '../../components/OrgForm';
import Page from '../../components/PageFrame';
import { Box, Flex, Text } from 'theme-ui';
import OrgSidebar from '../../components/OrgSidebar';
import PageHeader from '../../components/PageHeader';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <PageHeader title="Settings">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex>
          <OrgSidebar />
          <Box pl={4}>
            <Text mb={4}>Change Company Details</Text>
            <OrgForm />
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
