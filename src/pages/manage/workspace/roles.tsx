import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import { AddIcon } from '../../../components/Icons';
import { loadEntity } from '../../../utils/models';
import { useStoreState } from 'easy-peasy';

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
            <Box
              sx={{
                bg: 'bgWhite',
                border: '1px solid',
                borderColor: 'neutral.1',
                borderRadius: 4,
                p: 4,
                m: 4,
              }}></Box>
            {/* <Workspace /> */}
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
