import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';
import { Drawer, useDrawer, Button } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import { workspaceLinks } from '@constants/menuLinks';
import { InviteTeam } from 'components/manage';
import TeamList from 'components/manage/TeamList';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const menuDrawer = useDrawer();

  const { userProfile } = useAuth();
  const currentOrg = userProfile?.currentOrganisation?.name;

  const { hasPermission } = usePermission();

  const handleInviteSuccess = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    (currentOrg !== 'Personal' || '') && (
      <>
        <Head>
          <title>Members | Wraft</title>
          <meta name="layouts" content="workspace members" />
        </Head>
        <Page>
          <PageHeader
            title={[
              { name: 'Manage', path: '/manage' },
              { name: 'Workspace', path: '/manage/workspace' },
              { name: 'Members', path: '' },
            ]}>
            {hasPermission('members', 'manage') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(true)}>
                <Plus size={14} />
                Invite people
              </Button>
            )}
          </PageHeader>

          <PageInner>
            <Flex gap="xl">
              <ManageSidebar items={workspaceLinks} />
              <TeamList refresh={refresh} />
            </Flex>
          </PageInner>
        </Page>
        <Drawer
          open={isOpen}
          store={menuDrawer}
          onClose={() => setIsOpen(false)}>
          {isOpen && (
            <InviteTeam
              setOpen={setIsOpen}
              onInviteSuccess={handleInviteSuccess}
            />
          )}
        </Drawer>
      </>
    )
  );
};

export default Index;
