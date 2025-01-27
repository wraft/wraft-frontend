import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Box } from '@wraft/ui';

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

          <Flex gap="md" my="md" px="md">
            <ManageSidebar items={workspaceLinks} />
            <PermissionsList />
          </Flex>
        </Page>
      </>
    )
  );
};

export default Index;
