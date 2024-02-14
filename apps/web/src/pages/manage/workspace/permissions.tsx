import React, { FC } from 'react';
import Head from 'next/head';
import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import { Flex, Container, Box } from 'theme-ui';

import PermissionsList from '../../../components/manage/PermissionsList';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { workspaceLinks } from '../../../utils';

const Index: FC = () => {
  const { userProfile } = useAuth();
  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Layouts | Wraft Docs</title>
          <meta name="description" content="a nextjs starter boilerplate" />
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
