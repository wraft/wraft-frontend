import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import { InviteUserIcon } from '../../../components/Icons';
import TeamList from '../../../components/manage/TeamList';
const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <Button
            onClick={() => setIsOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InviteUserIcon />
            Invite people
          </Button>
        </PageHeader>
        <ModalCustom isOpen={isOpen} setOpen={setIsOpen}>
          <div />
          {/* <LayoutForm /> */}
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
  );
};

export default Index;
