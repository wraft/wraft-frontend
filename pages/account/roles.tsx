import { FC } from 'react';
import Head from 'next/head';
import Page from '../../src/components/PageFrame';
import { Flex, Box } from 'theme-ui';
import OrgRolesList from '../../src/components/OrgRolesList';
import OrgSidebar from '../../src/components/OrgSidebar';
import PageHeader from '../../src/components/PageHeader';

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
