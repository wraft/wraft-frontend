import React, { FC, useState } from 'react';
import Head from 'next/head';
import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import { Flex, Container, Box } from 'theme-ui';
import { Drawer, useDrawer, Button } from '@wraft/ui';

import { InviteUserIcon } from 'components/Icons';
import { InviteTeam } from 'components/manage';
import TeamList from 'components/manage/TeamList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import { useAuth } from 'contexts/AuthContext';
import { workspaceLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuDrawer = useDrawer();

  const { userProfile } = useAuth();
  const currentOrg = userProfile?.currentOrganisation?.name;

  return (
    (currentOrg !== 'Personal' || '') && (
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
                  { name: 'Members' },
                ]}
              />
            }>
            <Button variant="primary" onClick={() => setIsOpen(true)}>
              <InviteUserIcon />
              Invite people
            </Button>
          </PageHeader>
          <Drawer
            open={isOpen}
            store={menuDrawer}
            onClose={() => setIsOpen(false)}>
            {isOpen && <InviteTeam setOpen={setIsOpen} />}
          </Drawer>
          <Container variant="layout.pageFrame">
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box variant="layout.contentFrame">
                <TeamList />
              </Box>
            </Flex>
          </Container>
        </Page>
      </>
    )
  );
};

export default Index;
