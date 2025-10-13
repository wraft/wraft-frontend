import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Drawer, useDrawer, Flex } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

import { workspaceLinks } from '@constants/menuLinks';
import SimpleWebhookList from 'components/Webhook/WebhookList';
import WebhookForm from 'components/Webhook/WebhookForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { useAuth } from 'contexts/AuthContext';
import { usePermission } from 'utils/permissions';

const WebhooksPage = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { hasPermission } = usePermission();
  const { userProfile } = useAuth();
  const canCreateWebhooks = hasPermission('webhook', 'manage');
  const createDrawer = useDrawer();
  const editDrawer = useDrawer();
  const router = useRouter();
  const currentOrg = userProfile?.currentOrganisation?.name;

  const handleCreateSuccess = () => {
    setIsCreateDrawerOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEditSuccess = () => {
    setEditingWebhookId(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEdit = (webhookId: string) => {
    setEditingWebhookId(webhookId);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

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
          <title>Webhooks | Wraft</title>
          <meta
            name="description"
            content="Manage webhook endpoints and event subscriptions"
          />
        </Head>

        <Page>
          <PageHeader
            title="Workspace"
            desc={
              <DescriptionLinker
                data={[
                  { name: 'Manage', path: '/manage' },
                  { name: 'Webhooks' },
                ]}
              />
            }>
            {canCreateWebhooks && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateDrawerOpen(true)}>
                <Plus size={16} />
                New Webhook
              </Button>
            )}
          </PageHeader>

          <Flex gap="md" my="md" px="md">
            <ManageSidebar items={workspaceLinks} />
            <Flex direction="column" flex={1} minWidth="556px">
              <SimpleWebhookList
                key={refreshKey}
                onEdit={handleEdit}
                onRefresh={handleRefresh}
              />
            </Flex>
          </Flex>

          <Drawer
            open={isCreateDrawerOpen}
            store={createDrawer}
            withBackdrop={true}
            onClose={() => setIsCreateDrawerOpen(false)}>
            {isCreateDrawerOpen && (
              <WebhookForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setIsCreateDrawerOpen(false)}
              />
            )}
          </Drawer>

          <Drawer
            open={!!editingWebhookId}
            store={editDrawer}
            withBackdrop={true}
            onClose={() => setEditingWebhookId(null)}>
            {editingWebhookId && (
              <WebhookForm
                webhookId={editingWebhookId}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingWebhookId(null)}
              />
            )}
          </Drawer>
        </Page>
      </>
    )
  );
};

export default WebhooksPage;
