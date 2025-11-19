import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Flex } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import ApiKeyDetail from 'components/ApiKey/ApiKeyDetail';
import ApiKeyForm from 'components/ApiKey/ApiKeyForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';

const ApiKeyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { userProfile } = useAuth();
  const editDrawer = useDrawer();

  const handleEdit = () => {
    setIsEditDrawerOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDrawerOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);

    router.replace(router.asPath);
  };

  if (!id || typeof id !== 'string') {
    return null;
  }

  return userProfile?.currentOrganisation?.name !== 'Personal' || '' ? (
    <>
      <Head>
        <title>API Key Details | Wraft</title>
        <meta name="description" content="View API key details" />
      </Head>

      <Page>
        <PageHeader
          title="Workspace"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'API Keys', path: '/manage/workspace/api-keys' },
                { name: 'Details' },
              ]}
            />
          }
        />

        <PageInner>
          <Flex gap="xl">
            <ManageSidebar items={workspaceLinks} />
            <Flex direction="column" flex={1} minWidth="556px">
              <ApiKeyDetail
                key={refreshKey}
                apiKeyId={id}
                onEdit={handleEdit}
              />
            </Flex>
          </Flex>
        </PageInner>

        <Drawer
          open={isEditDrawerOpen}
          store={editDrawer}
          withBackdrop={true}
          onClose={() => setIsEditDrawerOpen(false)}>
          {isEditDrawerOpen && (
            <ApiKeyForm
              apiKeyId={id}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDrawerOpen(false)}
            />
          )}
        </Drawer>
      </Page>
    </>
  ) : null;
};

export default ApiKeyDetailPage;
