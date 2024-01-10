import React, { FC, useState } from 'react';

import { useStoreState } from 'easy-peasy';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import { InviteUserIcon } from '../../../components/Icons';
import { InviteTeam } from '../../../components/manage';
import TeamList from '../../../components/manage/TeamList';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { workspaceLinks } from '../../../utils';
import { Drawer } from '@wraft-ui/Drawer';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentOrg = useStoreState((state) => state.currentOrg.name);
  return (
    (currentOrg !== 'Personal' || '') && (
      <>
        <Head>
          <title>Layouts | Wraft Docs</title>
          <meta name="description" content="a nextjs starter boilerplate" />
        </Head>
        <Page>
          <PageHeader title="Manage Layouts" desc="Document Layouts">
            <Button
              variant="btnPrimary"
              onClick={() => setIsOpen(true)}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InviteUserIcon />
              Invite people
            </Button>
          </PageHeader>
          <Drawer open={isOpen} setOpen={setIsOpen}>
            <InviteTeam setOpen={setIsOpen} />
          </Drawer>
          <Container variant="layout.newPageFrame">
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
