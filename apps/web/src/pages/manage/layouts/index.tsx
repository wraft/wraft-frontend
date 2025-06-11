import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Drawer, Flex, useDrawer } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import { menuLinks } from '@constants/menuLinks';
import LayoutList from 'components/Layout/LayoutList';
import LayoutForm from 'components/Layout/LayoutForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const { hasPermission } = usePermission();

  const stateDrawer = useDrawer();

  return (
    <>
      <Head>
        <title>Layouts | Wraft</title>
        <meta name="description" content="wraft layouts" />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Layouts', path: '/manage/layouts' },
          ]}>
          {hasPermission('layout', 'manage') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(true)}>
              <Plus size={10} />
              Add Layout
            </Button>
          )}
        </PageHeader>
        <Drawer
          open={isOpen}
          store={stateDrawer}
          aria-label="field drawer"
          withBackdrop={true}
          onClose={() => setIsOpen(false)}>
          <LayoutForm setOpen={setIsOpen} setRerender={setRerender} />
        </Drawer>

        <PageInner>
          <LayoutList rerender={rerender} />
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
