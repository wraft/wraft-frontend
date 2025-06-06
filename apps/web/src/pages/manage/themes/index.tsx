import { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Flex, Drawer, useDrawer } from '@wraft/ui';

import { menuLinks } from '@constants/menuLinks';
import ThemeAddForm from 'components/Theme/ThemeForm';
import ThemeList from 'components/Theme/ThemeList';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { usePermission } from 'utils/permissions';

const ThemePage: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<any>(false);
  const drawer = useDrawer();
  const { hasPermission } = usePermission();

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
          {hasPermission('theme', 'manage') && (
            <Button variant="tertiary" onClick={() => setIsOpen(true)}>
              Add Theme
            </Button>
          )}
        </PageHeader>

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <ThemeList rerender={rerender} />
        </Flex>
      </Page>
      {/* 
      {hasPermission('the') && ( */}
      <Drawer
        open={isOpen}
        store={drawer}
        aria-label="theme drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && (
          <ThemeAddForm setIsOpen={setIsOpen} setRerender={setRerender} />
        )}
      </Drawer>
      {/* )} */}
    </>
  );
};

export default ThemePage;
