import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex, Button, Modal, Drawer } from '@wraft/ui';
import {
  FolderSimplePlusIcon,
  UploadSimpleIcon,
  ArrowsInIcon,
  ArrowsOutIcon,
  ShareIcon,
  LinkIcon,
  DownloadIcon,
  EyeIcon,
  TableIcon,
  FileTextIcon,
  CloudArrowDownIcon,
} from '@phosphor-icons/react';

import ConfirmDelete from 'common/ConfirmDelete';
import { FileDropZone } from 'common/FileDropZone';

import Breadcrumbs from './Breadcrumbs';
import { RepositoryTable } from './FileExplorerTable';
import { NewFolderModal } from './NewFolderModal';
import { RenameModal } from './RenameModal';
import { StorageItem } from '../types';
import { useRepository } from '../hooks/useRepository';
import { useRepositorySetup } from '../hooks/useRepositorySetup';
import { useFolderNavigation } from '../hooks/useFolderNavigation';
import { useFileDetails } from '../hooks/useFileDetails';
import { useRepositoryActions } from '../hooks/useRepositoryActions';
import { useItemOperations } from '../hooks/useItemOperations';
import { useUrlSync } from '../hooks/useUrlSync';
import { useIsNewFolderModalOpen } from '../store/repositoryStore';
import { RepositorySetup } from './RepositorySetup';
import { EmptyRepository } from './EmptyRepository';
import { StorageItemDetails as StorageItemDetailsComponent } from './StorageItemDetails';
import { RepositoryErrorBoundary } from './RepositoryErrorBoundary';
import { RepositorySetupSection } from './RepositorySetupSection';
import { GoogleDriveDrawer } from './GoogleDriveDrawer';

const RepositoryComponent: React.FC = React.memo(() => {
  const router = useRouter();
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [activeExpandedView, setActiveExpandedView] = useState<
    'preview' | 'data' | 'summary'
  >('preview');
  const [isRepositorySetupModalOpen, setIsRepositorySetupModalOpen] =
    useState(false);
  const [isGoogleDriveDrawerOpen, setIsGoogleDriveDrawerOpen] = useState(false);

  // Custom hooks
  const { currentFolderId, navigateToFolder, navigateToRoot } =
    useFolderNavigation();

  const {
    isSetup: isSetupFromHook,
    isLoading: isSetupLoading,
    error: setupError,
    // repositories,
    setupRepository,
    checkSetup,
  } = useRepositorySetup();

  const {
    items,
    createFolder,
    deleteFolder,
    deleteFile,
    refreshContents,
    currentFolder,
    breadcrumbs: breadcrumbsRepository,
    uploadFile,
    renameItem,
    isLoading: isRepositoryLoading,
  } = useRepository(currentFolderId);

  // File details hook
  const {
    selectedItemDetails,
    fileDetailsLoading,
    fileDetailsError,
    // openFileDetails,
    // clearFileDetails,
  } = useFileDetails();

  // Repository actions hook
  const {
    isRenameModalOpen,
    isItemDetailsOpen,
    isDeleteModalOpen,
    isUploadModalOpen,
    openNewFolderModal,
    closeNewFolderModal,
    openUploadModal,
    closeUploadModal,
    openDeleteModal,
    closeDeleteModal,
    openRenameModal,
    closeRenameModal,
    // closeItemDetails,
    // setLoading,
    setIsSetup,
    // addItem,
    // removeItem,
  } = useRepositoryActions();

  // URL synchronization hook
  const { handleItemClick, handleCloseItemDetails } = useUrlSync();

  // Modal state hooks
  const isNewFolderModalOpen = useIsNewFolderModalOpen();

  // Item operations hook
  const { handleDelete, handleNewFolder, handleUpload, handleRename } =
    useItemOperations({
      createFolder,
      deleteFolder,
      deleteFile,
      uploadFile,
      renameItem,
      selectedItemDetails,
    });

  // Sync the Zustand store with the repository setup status
  React.useEffect(() => {
    setIsSetup(isSetupFromHook);
  }, [isSetupFromHook, setIsSetup]);

  const handleBreadcrumbClick = useCallback(
    (crumbFolderId: string) => {
      if (crumbFolderId === 'root') {
        navigateToRoot();
      } else {
        navigateToFolder(crumbFolderId);
      }
    },
    [navigateToFolder, navigateToRoot],
  );

  const handleDeleteItem = useCallback(
    (item: StorageItem) => {
      openDeleteModal(item);
    },
    [openDeleteModal],
  );

  const handleDeleteConfirm = useCallback(async () => {
    await handleDelete();
  }, [handleDelete]);

  const handleNewFolderSubmit = useCallback(
    async (data: { name: string }) => {
      await handleNewFolder(data, currentFolder);
    },
    [handleNewFolder, currentFolder],
  );

  const handleUploadSubmit = useCallback(
    async (fileList: File[], options: { migrateToWraft: boolean }) => {
      await handleUpload(fileList, options);
    },
    [handleUpload],
  );

  const handleRenameSubmit = useCallback(
    async (newName: string) => {
      const success = await handleRename(newName);
      if (success) {
        closeRenameModal();
      }
    },
    [handleRename, closeRenameModal],
  );

  const handleUploadModalClose = useCallback(() => {
    closeUploadModal();
  }, [closeUploadModal]);

  const handleSetupRepository = useCallback(
    async (data: { name: string; description?: string }) => {
      await setupRepository(data);
      // After setup, refresh contents to load the repository
      await refreshContents();
    },
    [setupRepository, refreshContents],
  );

  const handleDownload = useCallback(async (_itemId: string) => {
    // TODO: Implement download functionality
  }, []);

  const handleShare = useCallback(async (_item: any) => {
    // TODO: Implement share functionality
  }, []);

  // Memoized loading state
  const isAnyLoading = useMemo(
    () => isSetupLoading || isRepositoryLoading,
    [isSetupLoading, isRepositoryLoading],
  );

  const handleToggleDrawerExpand = () => {
    setIsDrawerExpanded(!isDrawerExpanded);
  };

  // Show loading state while checking setup
  if (isSetupLoading) {
    return (
      <Box>
        <Flex justify="center" align="center" h="400px">
          <Text>Loading repository...</Text>
        </Flex>
      </Box>
    );
  }

  // Show setup error if there's an issue
  if (setupError) {
    return (
      <Box>
        <Flex
          justify="center"
          align="center"
          h="400px"
          direction="column"
          gap="md">
          <Text color="error" fontSize="lg">
            Error loading repository
          </Text>
          <Text color="text-secondary">{setupError}</Text>
          <Button onClick={checkSetup} variant="primary">
            Retry
          </Button>
        </Flex>
      </Box>
    );
  }

  // Show repository setup if not set up
  if (!isSetupFromHook) {
    return (
      <Box>
        <RepositorySetupSection
          onSetup={() => setIsRepositorySetupModalOpen(true)}
          isLoading={isAnyLoading}
        />

        {/* Repository Setup Modal */}
        <Modal
          ariaLabel="Setup Repository"
          open={isRepositorySetupModalOpen}
          onClose={() => setIsRepositorySetupModalOpen(false)}>
          <RepositorySetup
            onSetup={handleSetupRepository}
            onUpload={openUploadModal}
            isLoading={isAnyLoading}
            isOpen={isRepositorySetupModalOpen}
            onClose={() => setIsRepositorySetupModalOpen(false)}
          />
        </Modal>
      </Box>
    );
  }

  // Repository is set up, show content
  return (
    <Box>
      <Flex justify="space-between" align="center" mb="4">
        <Breadcrumbs
          items={breadcrumbsRepository}
          onNavigate={handleBreadcrumbClick}
        />
        <Flex gap="sm" alignItems="center">
          <Button
            variant="ghost"
            size="sm"
            onClick={openNewFolderModal}
            disabled={isAnyLoading}>
            <FolderSimplePlusIcon weight="regular" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openUploadModal}
            disabled={isAnyLoading}>
            <UploadSimpleIcon weight="regular" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsGoogleDriveDrawerOpen(true)}
            title="Google Drive Files">
            <CloudArrowDownIcon weight="regular" size={16} />
          </Button>
        </Flex>
      </Flex>

      {!items.length && (
        <EmptyRepository
          onNewFolder={openNewFolderModal}
          onUpload={openUploadModal}
        />
      )}

      {items.length > 0 && (
        <RepositoryTable
          items={items}
          onItemClick={(item) => handleItemClick(item, navigateToFolder)}
          onDelete={handleDeleteItem}
          onRename={openRenameModal}
          onNewFolder={openNewFolderModal}
        />
      )}

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={closeNewFolderModal}
        onSubmit={handleNewFolderSubmit}
      />

      <Modal
        ariaLabel="Delete Item"
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}>
        <>
          {selectedItemDetails && (
            <ConfirmDelete
              title="Delete Item"
              text={`Are you sure you want to delete '${selectedItemDetails.name}'?`}
              setOpen={closeDeleteModal}
              onConfirmDelete={handleDeleteConfirm}
            />
          )}
        </>
      </Modal>

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeRenameModal}
        onConfirm={handleRenameSubmit}
        currentName={selectedItemDetails?.name || ''}
        itemType={
          selectedItemDetails?.item_type === 'folder' ? 'folder' : 'file'
        }
      />

      {/* Upload Drawer */}
      <Drawer
        open={isUploadModalOpen}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}>
        <Drawer.Header>
          <Drawer.Title>Upload Files</Drawer.Title>
          <Button
            variant="ghost"
            onClick={handleUploadModalClose}
            style={{ padding: '8px' }}>
            ✕
          </Button>
        </Drawer.Header>
        <Box p="4" w="100%" maxW="500px">
          <FileDropZone
            showOpen={isUploadModalOpen}
            onDrop={handleUploadSubmit}
            onClose={handleUploadModalClose}
            isLoading={isAnyLoading}
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
              'application/msword': ['.doc'],
              'application/vnd.oasis.opendocument.text': ['.odt'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
              'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                ['.pptx'],
              'application/vnd.ms-powerpoint': ['.ppt'],
              'application/vnd.oasis.opendocument.presentation': ['.odp'],
              'text/plain': ['.txt'],
              'text/rtf': ['.rtf'],
            }}
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={10}
            multiple={true}
            onExtract={(_fileList) => {
              // Extract functionality
            }}
            onSkip={(_fileList) => {
              // Skip functionality
            }}
            onCheckMark={() => {
              router.push('/suggest');
              return false;
            }}
          />
        </Box>
      </Drawer>

      {/* Item Details Drawer */}
      <Drawer
        open={isItemDetailsOpen}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}>
        <Drawer.Header>
          <Drawer.Title>
            {selectedItemDetails
              ? selectedItemDetails.display_name || selectedItemDetails.name
              : 'Item Details'}
          </Drawer.Title>
          <Flex gap="xs" align="center">
            {selectedItemDetails && !selectedItemDetails.is_folder && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleShare}
                  title="Share file"
                  size="sm">
                  <ShareIcon size={16} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const shareableLink = `${window.location.origin}/files/${selectedItemDetails.id}`;
                    navigator.clipboard.writeText(shareableLink);
                  }}
                  title="Copy link"
                  size="sm">
                  <LinkIcon size={16} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(selectedItemDetails.id)}
                  title="Download file"
                  size="sm">
                  <DownloadIcon size={16} />
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              onClick={handleToggleDrawerExpand}
              title={isDrawerExpanded ? 'Collapse drawer' : 'Expand drawer'}
              size="sm">
              {isDrawerExpanded ? (
                <ArrowsInIcon size={16} />
              ) : (
                <ArrowsOutIcon size={16} />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCloseItemDetails}
              size="sm"
              shape="circle">
              ✕
            </Button>
          </Flex>
        </Drawer.Header>

        {isDrawerExpanded ? (
          // Expanded layout with centered viewer and floating toolbar
          <Box
            w="80%"
            h="calc(100vh - 80px)"
            transition="width 0.2s ease-out"
            mx="auto"
            overflow="hidden">
            <Flex h="100%" position="relative">
              {/* Main content area - centered like DocumentContentBlock */}
              <Box
                flex="1"
                overflowY="auto"
                p="md"
                display="flex"
                justifyContent="center">
                <Box minWidth="794px" maxWidth="920px" w="100%">
                  <StorageItemDetailsComponent
                    item={selectedItemDetails}
                    isLoading={fileDetailsLoading}
                    error={fileDetailsError}
                    onBack={handleCloseItemDetails}
                    isExpanded={isDrawerExpanded}
                    onToggleExpand={handleToggleDrawerExpand}
                    activeExpandedView={activeExpandedView}
                  />
                </Box>
              </Box>

              {/* Floating toolbar on the right */}
              <Box
                position="absolute"
                right="md"
                top="md"
                w="280px"
                backgroundColor="background"
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                boxShadow="lg"
                p="md"
                zIndex={10}>
                <Text fontSize="md" fontWeight="medium" mb="sm">
                  Tools
                </Text>
                <Flex direction="column" gap="xs">
                  <Button
                    variant={
                      activeExpandedView === 'preview' ? 'primary' : 'secondary'
                    }
                    size="sm"
                    onClick={() => setActiveExpandedView('preview')}>
                    <EyeIcon size={16} />
                    <Text as="span" ml="xs">
                      Preview
                    </Text>
                  </Button>
                  <Button
                    variant={
                      activeExpandedView === 'data' ? 'primary' : 'secondary'
                    }
                    size="sm"
                    onClick={() => setActiveExpandedView('data')}>
                    <TableIcon size={16} />
                    <Text as="span" ml="xs">
                      Data
                    </Text>
                  </Button>
                  <Button
                    variant={
                      activeExpandedView === 'summary' ? 'primary' : 'secondary'
                    }
                    size="sm"
                    onClick={() => setActiveExpandedView('summary')}>
                    <FileTextIcon size={16} />
                    <Text as="span" ml="xs">
                      Summary
                    </Text>
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Box>
        ) : (
          // Normal drawer layout
          <Box p="md" w="600px" overflowY="auto" h="calc(100vh - 80px)">
            <StorageItemDetailsComponent
              item={selectedItemDetails}
              isLoading={fileDetailsLoading}
              error={fileDetailsError}
              onBack={handleCloseItemDetails}
              isExpanded={isDrawerExpanded}
              onToggleExpand={handleToggleDrawerExpand}
              activeExpandedView={activeExpandedView}
            />
          </Box>
        )}
      </Drawer>

      {/* Google Drive Drawer */}
      <GoogleDriveDrawer
        isOpen={isGoogleDriveDrawerOpen}
        onClose={() => setIsGoogleDriveDrawerOpen(false)}
      />
    </Box>
  );
});
RepositoryComponent.displayName = 'Repository';

// Export with error boundary wrapper
export const Repository: React.FC = () => (
  <RepositoryErrorBoundary>
    <RepositoryComponent />
  </RepositoryErrorBoundary>
);
