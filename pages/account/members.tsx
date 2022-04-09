import { FC } from 'react';
import Head from 'next/head';
import OrgMemberForm from '../../src/components/OrgMemberForm';
import Page from '../../src/components/PageFrame';
import { Flex, Box } from 'theme-ui';
import OrgSidebar from '../../src/components/OrgSidebar';
import PageHeader from '../../src/components/PageHeader';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft Doc</title>
        <meta name="description" content="Wraft Docs" />
      </Head>
      <Page>
        <PageHeader title="Members">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex>
          <OrgSidebar />
          <Box pl={4}>
            <OrgMemberForm />
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
