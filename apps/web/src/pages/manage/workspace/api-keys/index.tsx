import React, { useState } from 'react';
import Head from 'next/head';
import { Button, Drawer, useDrawer, Flex } from '@wraft/ui';
import { PlusIcon } from '@phosphor-icons/react';

import { workspaceLinks } from '@constants/menuLinks';
import ApiKeyList from 'components/ApiKey/ApiKeyList';
import ApiKeyForm from 'components/ApiKey/ApiKeyForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const ApiKeysPage = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingApiKeyId, setEditingApiKeyId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { hasPermission } = usePermission();
  const { userProfile } = useAuth();
  const canCreateApiKeys = hasPermission('api_key', 'manage');
  const createDrawer = useDrawer();
  const editDrawer = useDrawer();

  const handleCreateSuccess = () => {
    setIsCreateDrawerOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEditSuccess = () => {
    setEditingApiKeyId(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEdit = (apiKeyId: string) => {
    setEditingApiKeyId(apiKeyId);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return userProfile?.currentOrganisation?.name !== 'Personal' || '' ? (
    <>
      <Head>
        <title>API Keys | Wraft</title>
        <meta
          name="description"
          content="Manage API keys for third-party integrations"
        />
      </Head>

      <Page>
        <PageHeader
          title="Workspace"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'API Keys' }]}
            />
          }>
          {canCreateApiKeys && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateDrawerOpen(true)}>
              <PlusIcon size={16} />
              New API Key
            </Button>
          )}
        </PageHeader>

        <PageInner>
          <Flex gap="xl">
            <ManageSidebar items={workspaceLinks} />
            <Flex direction="column" flex={1} minWidth="556px">
              <ApiKeyList
                key={refreshKey}
                refreshKey={refreshKey}
                onEdit={handleEdit}
                onRefresh={handleRefresh}
              />
            </Flex>
          </Flex>
        </PageInner>

        <Drawer
          open={isCreateDrawerOpen}
          store={createDrawer}
          withBackdrop={true}
          onClose={() => setIsCreateDrawerOpen(false)}>
          {isCreateDrawerOpen && (
            <ApiKeyForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDrawerOpen(false)}
            />
          )}
        </Drawer>

        <Drawer
          open={!!editingApiKeyId}
          store={editDrawer}
          withBackdrop={true}
          onClose={() => setEditingApiKeyId(null)}>
          {editingApiKeyId && (
            <ApiKeyForm
              apiKeyId={editingApiKeyId}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingApiKeyId(null)}
            />
          )}
        </Drawer>
      </Page>
    </>
  ) : null;
};

export default ApiKeysPage;
