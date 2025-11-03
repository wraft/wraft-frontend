import { FC } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';
import { useNotificationSidebarMode } from 'hooks/useNotificationSidebarMode';

import NotificationSettings from 'components/Notification/NotificationSettings';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import ManageSidebar from 'common/ManageSidebar';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';

const WorkspaceNotificationSettings: FC = () => {
  const { userProfile } = useAuth();
  const currentOrganisation = userProfile?.currentOrganisation;
  const { itemsForSidebar } = useNotificationSidebarMode(
    currentOrganisation?.name,
  );

  return (
    <>
      <Head>
        <title>Workspace Notification Settings - Wraft Docs</title>
        <meta
          name="description"
          content="Manage Workspace Notification Settings"
        />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Workspace', path: '/manage/workspace' },
            { name: 'Notification', path: '' },
          ]}
        />
        <PageInner>
          <Flex gap="xl">
            <ManageSidebar items={itemsForSidebar} />
            <NotificationSettings />
          </Flex>
        </PageInner>
      </Page>
    </>
  );
};

export default WorkspaceNotificationSettings;
