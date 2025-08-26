import { FC } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import NotificationSettings from 'components/Notification/NotificationSettings';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import ManageSidebar from 'common/ManageSidebar';
import { PageInner } from 'common/Atoms';

const WorkspaceNotificationSettings: FC = () => {
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
            <ManageSidebar items={workspaceLinks} />
            <NotificationSettings />
          </Flex>
        </PageInner>
      </Page>
    </>
  );
};

export default WorkspaceNotificationSettings;
