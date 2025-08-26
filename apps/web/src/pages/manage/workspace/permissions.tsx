import React, { FC } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import PermissionsList from 'components/manage/PermissionsList';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';

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
            title={[
              { name: 'Manage', path: '/manage' },
              { name: 'Workspace', path: '/manage/workspace' },
              { name: 'Permission', path: '' },
            ]}
          />
          <PageInner>
            <Flex gap="xl">
              <ManageSidebar items={workspaceLinks} />
              <PermissionsList />
            </Flex>
          </PageInner>
        </Page>
      </>
    )
  );
};

export default Index;
