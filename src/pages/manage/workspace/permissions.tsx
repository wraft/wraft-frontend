import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalLeft from '../../../components/ModalLeft';
import { InviteUserIcon } from '../../../components/Icons';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        <ModalLeft isOpen={isOpen} setOpen={setIsOpen}>
          {/* <LayoutForm /> */}
        </ModalLeft>
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={workspaceLinks} />
            {/* <Workspace /> */}
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
