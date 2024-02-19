import React, { FC, useState } from 'react';

import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import { Drawer } from '@wraft-ui/Drawer';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import { InviteUserIcon } from '../../../components/Icons';
import { InviteTeam } from '../../../components/manage';
import TeamList from '../../../components/manage/TeamList';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { workspaceLinks } from '../../../utils';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Button
              variant="btnPrimary"
              onClick={() => setIsOpen(true)}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InviteUserIcon />
              Invite people
            </Button>
          </PageHeader>
          <Drawer open={isOpen} setOpen={setIsOpen}>
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
