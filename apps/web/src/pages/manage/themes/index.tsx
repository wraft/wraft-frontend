import { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Flex, Drawer, useDrawer } from '@wraft/ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import ThemeAddForm from 'components/Theme/ThemeForm';
import ThemeList from 'components/Theme/ThemeList';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<any>(false);
  const drawer = useDrawer();
  return (
    <>
      <Head>
        <title>Themes | Wraft</title>
        <meta name="description" content="wraft themes" />
      </Head>
      <Page>
        <PageHeader
          title="Themes"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Themes' }]}
            />
          }>
          <Button variant="tertiary" onClick={() => setIsOpen(true)}>
            Add Theme
          </Button>
        </PageHeader>

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <ThemeList rerender={rerender} />
        </Flex>
      </Page>

      <Drawer
        open={isOpen}
        store={drawer}
        aria-label="flow drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && (
          <ThemeAddForm setIsOpen={setIsOpen} setRerender={setRerender} />
        )}
      </Drawer>
    </>
  );
};

export default Index;
