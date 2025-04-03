import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Spinner } from 'theme-ui';
import { Plus } from '@phosphor-icons/react';
import { SearchIcon } from '@wraft/icon';
import { Button, Flex, Box, InputText, Drawer, useDrawer } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import { RolesForm, RolesList } from 'components/manage';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLoading, setFilterLoading] = useState<boolean>(false);

  const { userProfile } = useAuth();
  const roleDrawer = useDrawer();
  const { hasPermission, hasAllPermissions } = usePermission();

  const canSearchRole = hasAllPermissions([
    { router: 'role', action: 'show' },
    { router: 'role', action: 'manage' },
  ]);

  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Roles | Wraft</title>
          <meta name="description" content="workspace roles" />
        </Head>
        <Page>
          <PageHeader
            title="Workspace"
            desc={
              <DescriptionLinker
                data={[
                  { name: 'Manage', path: '/manage' },
                  { name: 'General' },
                ]}
              />
            }>
            <Flex alignItems="center" gap="md">
              {canSearchRole && (
                <Box w="340px" display="block">
                  <InputText
                    icon={
                      filterLoading ? (
                        <Spinner width={14} />
                      ) : (
                        <SearchIcon className="searchIcon" />
                      )
                    }
                    iconPlacement="right"
                    placeholder="Search by role names"
                    width="100%"
                    onChange={(e: any) => {
                      setFilterLoading(true);
                      setTimeout(() => setSearchTerm(e.target.value), 1000);
                    }}
                  />
                </Box>
              )}

              {hasPermission('role', 'manage') && (
                <Button variant="primary" onClick={() => setIsOpen(true)}>
                  <Plus size={14} weight="bold" />
                  Create Role
                </Button>
              )}
            </Flex>
          </PageHeader>

          <Flex gap="md" my="md" px="md">
            <ManageSidebar items={workspaceLinks} />

            <RolesList
              render={render}
              setRender={setRender}
              searchTerm={searchTerm}
              setFilterLoading={setFilterLoading}
            />
          </Flex>
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
