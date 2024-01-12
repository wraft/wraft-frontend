import React, { FC } from 'react';

import Head from 'next/head';
import { Flex, Container, Button } from 'theme-ui';

import FlowForm from '../../../components/FlowForm';
import FlowList from '../../../components/FlowList';
import ManageSidebar from '../../../components/ManageSidebar';
import Modal from '../../../components/Modal';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  console.log('render state', rerender);
  return (
    <>
      <Head>
        <title>Manage Flows - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader
          title="Manage Flows"
          desc="Manage Configurations for your workspace">
          <Button
            onClick={() => {
              setIsOpen(true);
            }}>
            Add Flow
          </Button>
        </PageHeader>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <FlowForm setOpen={setIsOpen} setRerender={setRerender} />
        </Modal>
        <Container sx={{ pl: 4, pt: 4 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowList rerender={rerender} setRerender={setRerender} />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
