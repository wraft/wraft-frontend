import { FC } from 'react';
import Head from 'next/head';
import Page from '../../components/PageFrame';
import { Flex, Box } from 'theme-ui';
import OrgRolesList from '../../components/OrgRolesList';
import OrgSidebar from '../../components/OrgSidebar';
import PageHeader from '../../components/PageHeader';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Roles</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <PageHeader title="Roles">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex>
          <OrgSidebar />
          <Box pl={4}>
            <OrgRolesList />
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
