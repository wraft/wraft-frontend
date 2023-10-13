import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import { InviteUserIcon } from '../../../components/Icons';

const Index: FC = () => {
  const token = useStoreState((state) => state.auth.token);
  const [isOpen, setIsOpen] = React.useState(false);
  function onsuccess(data: any) {
    console.log(data);
  }
  loadEntity(token, 'roles', onsuccess);
  React.useEffect(() => {
    loadEntity;
  }, []);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage roles" desc="Document Layouts">
          <Button
            // variant="btnPrimary"
            onClick={() => setIsOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AddIcon />
            Create new role
          </Button>
        </PageHeader>
        <ModalCustom isOpen={isOpen} setOpen={setIsOpen}>
          {/* <LayoutForm /> */}
        </ModalCustom>
        <Container
          sx={{
            px: 4,
            pt: 0,
            height: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            bg: 'background',
          }}>
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
