import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Button, Drawer, useDrawer } from '@wraft/ui';

import { menuLinks } from '@constants/menuLinks';
import FlowList from 'components/Flow/FlowList';
import FlowForm from 'components/Flow/FlowForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  const drawer = useDrawer();

  return (
    <>
      <Head>
        <title>Manage Flows | Wraft</title>
        <meta name="description" content="wraft flows" />
      </Head>
      <Page>
        <PageHeader
          title="Flows"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Flows' }]}
            />
          }>
          <Button variant="tertiary" onClick={() => setIsOpen(true)}>
            Add Flow
          </Button>
        </PageHeader>
        <Drawer
          open={isOpen}
          store={drawer}
          aria-label="flow drawer"
          withBackdrop={true}
          onClose={() => setIsOpen(false)}>
          {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
        </Drawer>

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <FlowList rerender={rerender} setRerender={setRerender} />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
