import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Box } from 'theme-ui';

import PermissionsList from 'components/manage/PermissionsList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { useAuth } from 'contexts/AuthContext';
import { workspaceLinks } from 'utils/index';

const Index: FC = () => {
  const { userProfile } = useAuth();
  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Permission | Wraft</title>
          <meta name="description" content="workspace permissions" />
        </Head>
        <Page>
          <PageHeader
            title="Workspace"
            desc={
              <DescriptionLinker
                data={[
                  { name: 'Manage', path: '/manage' },
                  { name: 'Permissions' },
                ]}
              />
            }
          />
          <Container variant="layout.pageFrame">
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box variant="layout.contentFrame">
                <PermissionsList />
              </Box>
            </Flex>
          </Container>
        </Page>
      </>
    )
  );
};

export default Index;
