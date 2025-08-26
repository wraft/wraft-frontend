import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Button, Drawer, useDrawer } from '@wraft/ui';
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';

import FlowList from 'components/Flow/FlowList';
import FlowForm from 'components/Flow/FlowForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  const drawer = useDrawer();
  const { hasPermission } = usePermission();

  return (
    <>
      <Head>
        <title>Manage Flows | Wraft</title>
        <meta name="description" content="wraft flows" />
      </Head>
      <Page>
        <PageHeader
          title={[
            {
              name: 'Manage',
              path: '/manage',
            },
            {
              name: 'Flows',
              path: '/manage/flows',
            },
          ]}
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Flows' }]}
            />
          }>
          <Flex gap="sm">
            {hasPermission('flow', 'manage') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(true)}>
                Add Flow
              </Button>
            )}
            {hasPermission('flow', 'manage') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(true)}>
                <DotsThreeVerticalIcon stroke="bold" color="gray.700" />
              </Button>
            )}
          </Flex>
        </PageHeader>
        <Drawer
          open={isOpen}
          store={drawer}
          aria-label="flow drawer"
          withBackdrop={true}
          onClose={() => setIsOpen(false)}>
          {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
        </Drawer>

        <PageInner>
          <FlowList rerender={rerender} setRerender={setRerender} />
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
