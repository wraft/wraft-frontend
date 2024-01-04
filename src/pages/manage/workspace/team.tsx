import React, { FC, useState } from 'react';

import { useStoreState } from 'easy-peasy';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import { InviteUserIcon } from '../../../components/Icons';
import { InviteTeam } from '../../../components/manage';
import TeamList from '../../../components/manage/TeamList';
import ManageSidebar from '../../../components/ManageSidebar';
import ModalCustom from '../../../components/ModalCustom';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { workspaceLinks } from '../../../utils';

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
          <ModalCustom varient="right" isOpen={isOpen} setOpen={setIsOpen}>
            <InviteTeam setOpen={setIsOpen} />
          </ModalCustom>
          <Container
            sx={{
              pt: 0,
              height: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              bg: 'background',
            }}>
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box
                sx={{
                  width: '100%',
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  m: 4,
                }}>
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
