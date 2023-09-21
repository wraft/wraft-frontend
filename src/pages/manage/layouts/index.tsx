import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button } from 'theme-ui';
import Modal from 'react-modal';

import LayoutList from '../../../components/LayoutList';
import LayoutForm from '../../../components/LayoutForm';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    // Set the app element to document.body when the component mounts (client-side).
    Modal.setAppElement(document.body);
  }, []);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <Button onClick={() => setIsOpen(true)}>Add Laybout</Button>
        </PageHeader>
        <Modal
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => setIsOpen(false)}
          isOpen={isOpen}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.50)',
            },
            content: {
              marginLeft: 'auto',
              minWidth: '582px',
              width: '40%',
              height: '100%',
              right: '0px',
              top: '0px',
              borderRadius: '0px',
              padding: '0px',
            },
          }}>
          <LayoutForm />
        </Modal>
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <LayoutList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
