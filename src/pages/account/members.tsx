import { FC } from 'react';
import Head from 'next/head';
import OrgMemberForm from '../../components/OrgMemberForm';
import Page from '../../components/PageFrame';
import { Flex, Box } from 'theme-ui';
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
        <PageHeader title="Settings" desc="Members">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex sx={{ px: 4 }}>
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
