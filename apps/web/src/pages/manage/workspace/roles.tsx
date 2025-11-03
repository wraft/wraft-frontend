import React, { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Spinner } from '@wraft/ui';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { Button, Flex, Box, InputText, Drawer, useDrawer } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import { RolesForm, RolesList } from 'components/manage';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { IconFrame, PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLoading, setFilterLoading] = useState<boolean>(false);

  const { userProfile } = useAuth();
  const roleDrawer = useDrawer();
  const { hasPermission } = usePermission();
  const router = useRouter();
  const currentOrg = userProfile?.currentOrganisation?.name;

  useEffect(() => {
    if (currentOrg === 'Personal') {
      router.replace('/404');
    }
  }, [currentOrg, router]);

  if (currentOrg === 'Personal') return null;

  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Roles | Wraft</title>
          <meta name="description" content="workspace roles" />
        </Head>
        <Page>
          <PageHeader
            title={[
              { name: 'Manage', path: '/manage' },
              { name: 'Workspace', path: '/manage/workspace' },
              { name: 'Role', path: '' },
            ]}>
            <Flex alignItems="center" gap="md">
              {hasPermission('role', 'manage') && (
                <Box display="block">
                  <InputText
                    size="sm"
                    borderRadius="md2"
                    icon={
                      filterLoading ? (
                        <Spinner />
                      ) : (
                        <IconFrame color="icon">
                          <MagnifyingGlassIcon width="1.25rem" weight="bold" />
                        </IconFrame>
                      )
                    }
                    iconPlacement="right"
                    placeholder="Search by role names"
                    onChange={(e: any) => {
                      setFilterLoading(true);
                      setTimeout(() => setSearchTerm(e.target.value), 1000);
                    }}
                  />
                </Box>
              )}

              {hasPermission('role', 'manage') && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsOpen(true)}>
                  <PlusIcon size={14} weight="bold" />
                  Create Role
                </Button>
              )}
            </Flex>
          </PageHeader>
          <PageInner>
            <Flex gap="xl">
              <ManageSidebar items={workspaceLinks} />

              <RolesList
                render={render}
                setRender={setRender}
                searchTerm={searchTerm}
                setFilterLoading={setFilterLoading}
              />
            </Flex>
          </PageInner>
        </Page>

        <Drawer
          open={isOpen}
          store={roleDrawer}
          withBackdrop={true}
          onClose={() => setIsOpen(false)}>
          <RolesForm key={1} setOpen={setIsOpen} setRender={setRender} />
        </Drawer>
      </>
    )
  );
  // }}
};

export default Index;
