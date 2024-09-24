import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import ManageSidebar from 'components/ManageSidebar';
import OrgForm from 'components/OrgForm';
import Page from 'components/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { workspaceLinks } from 'utils/index';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Organization | Wraft</title>
        <meta name="description" content="manage organization in wraft" />
      </Head>
      <Page>
        <PageHeader
          title="Workspace"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'General' }]}
            />
          }
        />

        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={workspaceLinks} />
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

export default CompanyForm;
