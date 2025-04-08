import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';
import { Drawer, useDrawer, Button } from '@wraft/ui';
import { UserPlus } from '@phosphor-icons/react';

import { workspaceLinks } from '@constants/menuLinks';
import { InviteTeam } from 'components/manage';
import TeamList from 'components/manage/TeamList';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuDrawer = useDrawer();

  const { userProfile } = useAuth();
  const currentOrg = userProfile?.currentOrganisation?.name;

  const { hasPermission } = usePermission();

  return (
    (currentOrg !== 'Personal' || '') && (
      <>
        <Head>
          <title>Members | Wraft</title>
          <meta name="layouts" content="workspace members" />
        </Head>
        <Page>
          <PageHeader
            title="Workspace"
            desc={
              <DescriptionLinker
                data={[
                  { name: 'Manage', path: '/manage' },
                  { name: 'Members' },
                ]}
              />
            }>
            {hasPermission('members', 'manage') && (
              <Button variant="primary" onClick={() => setIsOpen(true)}>
                <UserPlus size={16} />
                Invite people
              </Button>
            )}
          </PageHeader>
          <Drawer
            open={isOpen}
            store={menuDrawer}
            onClose={() => setIsOpen(false)}>
            {isOpen && <InviteTeam setOpen={setIsOpen} />}
          </Drawer>

          <Flex gap="md" my="md" px="md">
            <ManageSidebar items={workspaceLinks} />
            <TeamList />
          </Flex>
        </Page>
      </>
    )
  );
};

export default Index;
