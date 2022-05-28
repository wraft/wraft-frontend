import { FC } from 'react';
import Head from 'next/head';
import Page from '../../src/components/PageFrame';
import { Flex, Box } from 'theme-ui';
import OrgPermissionList from '../../src/components/OrgPermissionList';
import OrgRolesList from '../../src/components/OrgRolesList';
import OrgSidebar from '../../src/components/OrgSidebar';
import PageHeader from '../../src/components/PageHeader';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Roles/Permissions | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <PageHeader title="Permissions">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex>
          <OrgSidebar />
          <Box pl={4}>
            <OrgPermissionList />
            <OrgRolesList />
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
