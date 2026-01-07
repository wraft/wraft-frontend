import { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Drawer, useDrawer } from '@wraft/ui';

import ThemeAddForm from 'components/Theme/ThemeForm';
import ThemeList from 'components/Theme/ThemeList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { usePermission } from 'utils/permissions';

const ThemePage: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const drawer = useDrawer();
  const { hasPermission } = usePermission();

  const handleThemeSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>Themes | Wraft</title>
        <meta name="description" content="wraft themes" />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Themes', path: '/manage/themes' },
          ]}
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Themes' }]}
            />
          }>
          {hasPermission('theme', 'manage') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(true)}>
              Add Theme
            </Button>
          )}
        </PageHeader>

        <PageInner>
          <ThemeList refreshKey={refreshKey} />
        </PageInner>
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
          <ThemeAddForm setIsOpen={setIsOpen} onSuccess={handleThemeSuccess} />
        )}
      </Drawer>
      {/* )} */}
    </>
  );
};

export default ThemePage;
