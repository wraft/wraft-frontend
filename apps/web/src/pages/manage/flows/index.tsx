import React, { FC } from 'react';

import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

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
          title="Flows"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Flows' }]}
            />
          }>
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
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <FlowList rerender={rerender} setRerender={setRerender} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
