import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Drawer, Flex, useDrawer } from '@wraft/ui';

import { menuLinks } from '@constants/menuLinks';
import LayoutList from 'components/Layout/LayoutList';
import LayoutForm from 'components/Layout/LayoutForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  const stateDrawer = useDrawer();

  return (
    <>
      <Head>
        <title>Layouts | Wraft</title>
        <meta name="description" content="wraft layouts" />
      </Head>
      <Page>
        <PageHeader
          title="Layouts"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Layouts' }]}
            />
          }>
          <Button variant="secondary" onClick={() => setIsOpen(true)}>
            + Add Layout
          </Button>
        </PageHeader>
        <Drawer
          open={isOpen}
          store={stateDrawer}
          aria-label="field drawer"
          withBackdrop={true}
          onClose={() => setIsOpen(false)}>
          <LayoutForm setOpen={setIsOpen} setRerender={setRerender} />
        </Drawer>

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <LayoutList rerender={rerender} />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
