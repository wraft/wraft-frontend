import { FC } from 'react';
import Head from 'next/head';
import Page from '../../components/PageFrame';
import { Flex, Box } from 'theme-ui';
import OrgPermissionList from '../../components/OrgPermissionList';
import OrgRolesList from '../../components/OrgRolesList';
import OrgSidebar from '../../components/OrgSidebar';
import PageHeader from '../../components/PageHeader';

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
