import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Flex } from '@wraft/ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import LayoutList from 'components/Layout/LayoutList';
import LayoutForm from 'components/Layout/LayoutForm';
import PageHeader from 'common/PageHeader';
import { Drawer } from 'common/Drawer';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
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
        <Drawer open={isOpen} setOpen={setIsOpen}>
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
