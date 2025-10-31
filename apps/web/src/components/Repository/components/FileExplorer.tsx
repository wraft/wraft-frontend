import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import toast from 'react-hot-toast';

import ConfirmDelete from 'common/ConfirmDelete';
import { FileDropZone } from 'common/FileDropZone';

import Breadcrumbs from './Breadcrumbs';
import { RepositoryTable } from './FileExplorerTable';
import { ListView } from './ListView';
import { ViewToggle, ViewType } from './ViewToggle';
import { NewFolderModal } from './NewFolderModal';
import { RenameModal } from './RenameModal';
import { StorageItem, StorageItemDetails } from '../types';
import { useRepository } from '../hooks/useRepository';
import { useRepositorySetup } from '../hooks/useRepositorySetup';
import { useFolderNavigation } from '../hooks/useFolderNavigation';
import { useFileDetails } from '../hooks/useFileDetails';
import { useRepositoryActions } from '../hooks/useRepositoryActions';
import { useItemOperations } from '../hooks/useItemOperations';
import { useUrlSync } from '../hooks/useUrlSync';
import { useSearch } from '../hooks/useSearch';
import {
  useRepositoryItems,
  useCurrentFolder,
  useBreadcrumbs,
  useIsLoading as useRepositoryDataLoading,
} from '../store/repositoryDataStore';
import {
  useIsNewFolderModalOpen,
  useItemToDelete,
  useItemToRename,
} from '../store/repositoryUIStore';
import { RepositorySetup } from './RepositorySetup';
import { EmptyRepository } from './EmptyRepository';
import { StorageItemDetails as StorageItemDetailsComponent } from './StorageItemDetails';
import { RepositoryErrorBoundary } from './RepositoryErrorBoundary';
import { RepositorySetupSection } from './RepositorySetupSection';
import { GoogleDriveDrawer } from './GoogleDriveDrawer';
import { StorageQuotaDisplay } from './StorageQuotaDisplay';
import { SearchBar, SearchFilters } from './SearchBar';
import { RepositoryService } from '../services/repositoryService';

const RepositoryComponent: React.FC = React.memo(() => {
  const router = useRouter();
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [activeExpandedView, setActiveExpandedView] = useState<
    'preview' | 'data' | 'summary'
  >('preview');
  const [isRepositorySetupModalOpen, setIsRepositorySetupModalOpen] =
    useState(false);
  const [isGoogleDriveDrawerOpen, setIsGoogleDriveDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('table');

  // Custom hooks
  const { currentFolderId, navigateToFolder, navigateToRoot } =
    useFolderNavigation();

  const {
    isSetup: isSetupFromHook,
    isLoading: isSetupLoading,
    error: setupError,
    setupRepository,
    checkSetup,
  } = useRepositorySetup();

  const items = useRepositoryItems();
  const currentFolder = useCurrentFolder();
  const breadcrumbsRepository = useBreadcrumbs();
  const isRepositoryDataLoading = useRepositoryDataLoading();

  const {
    createFolder,
    deleteFolder,
    deleteFile,
    refreshContents,
    uploadFile,
    renameItem,
    isLoading: isRepositoryLoading,
  } = useRepository(currentFolderId);

  console.log('test abc [items]', items);

  const {
    selectedItemDetails,
    fileDetailsLoading,
    fileDetailsError,
    // openFileDetails,
    // clearFileDetails,
  } = useFileDetails();

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

  const { handleItemClick, handleCloseItemDetails } = useUrlSync();

  const {
    search,
    clearSearch,
    isSearchActive,
    results: searchResults,
    isSearching,
    error: searchError,
    totalResults,
  } = useSearch();

  const isNewFolderModalOpen = useIsNewFolderModalOpen();
  const itemToDelete = useItemToDelete();
  const itemToRename = useItemToRename();

  const { handleDelete, handleNewFolder, handleUpload, handleRename } =
    useItemOperations({
      createFolder,
      deleteFolder,
      deleteFile,
      uploadFile,
      renameItem,
    });

  useEffect(() => {
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
      await refreshContents();
    },
    [setupRepository, refreshContents],
  );

  const handleDownload = useCallback(
    async (item: StorageItem | StorageItemDetails) => {
      console.log('test [handleDownload]', item);
      try {
        await RepositoryService.downloadFile(item);
      } catch (error) {
        toast.error('Failed to download file');
      }
    },
    [],
  );

  const handleShare = useCallback(
    async (item: StorageItem | StorageItemDetails) => {
      // TODO: Implement share functionality
      console.log('Share item:', item.id);
    },
    [],
  );

  const isAnyLoading = useMemo(
    () =>
      isSetupLoading ||
      isRepositoryLoading ||
      isRepositoryDataLoading ||
      isSearching,
    [isSetupLoading, isRepositoryLoading, isRepositoryDataLoading, isSearching],
  );

  const handleSearch = useCallback(
    async (query: string, filters: SearchFilters) => {
      await search(query, filters);
    },
    [search],
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  const displayItems = useMemo(() => {
    return isSearchActive ? searchResults : items;
  }, [isSearchActive, searchResults, items]);

  const handleToggleDrawerExpand = () => {
    setIsDrawerExpanded(!isDrawerExpanded);
  };

  if (isSetupLoading) {
    return (
      <Box>
        <Flex justify="center" align="center" h="400px">
          <Text>Loading repository...</Text>
        </Flex>
      </Box>
    );
  }

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

  if (!isSetupFromHook) {
    return (
      <Box>
        <RepositorySetupSection
          onSetup={() => setIsRepositorySetupModalOpen(true)}
          isLoading={isAnyLoading}
        />

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

  console.log('test [breadcrumbsRepository]', breadcrumbsRepository);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="lg">
        <Breadcrumbs
          items={breadcrumbsRepository}
          onNavigate={handleBreadcrumbClick}
        />
        <Flex gap="sm" alignItems="center">
          <Button
            variant="secondary"
            size="sm"
            onClick={openNewFolderModal}
            disabled={isAnyLoading}>
            <FolderSimplePlusIcon weight="regular" size={16} />
            New Folder
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={openUploadModal}
            disabled={isAnyLoading}>
            <UploadSimpleIcon weight="regular" size={16} />
            Upload Files
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsGoogleDriveDrawerOpen(true)}
            title="Google Drive Files">
            <CloudArrowDownIcon weight="regular" size={16} />
            Google Drive Files
          </Button>
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            disabled={isAnyLoading}
          />
        </Flex>
      </Flex>

      <Box mb="lg">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isLoading={isSearching}
        />
      </Box>

      {isSearchActive && (
        <Box mb="md">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="text-secondary">
              {isSearching
                ? 'Searching...'
                : `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`}
            </Text>
            {searchError && (
              <Text fontSize="sm" color="error">
                {searchError}
              </Text>
            )}
          </Flex>
        </Box>
      )}

      {!displayItems.length && !isSearchActive && (
        <EmptyRepository
          onNewFolder={openNewFolderModal}
          onUpload={openUploadModal}
        />
      )}

      {isSearchActive && !displayItems.length && !isSearching && (
        <Box textAlign="center" py="xl">
          <Text fontSize="lg" color="text-secondary" mb="sm">
            No results found
          </Text>
          <Text fontSize="sm" color="text-secondary">
            Try adjusting your search terms or filters
          </Text>
        </Box>
      )}

      {displayItems.length > 0 && (
        <>
          {currentView === 'table' ? (
            <RepositoryTable
              items={displayItems}
              onItemClick={(item) => handleItemClick(item, navigateToFolder)}
              onDelete={handleDeleteItem}
              onRename={openRenameModal}
              onNewFolder={openNewFolderModal}
              onDownload={handleDownload}
              onShare={handleShare}
              isLoading={isAnyLoading}
            />
          ) : (
            <ListView
              items={displayItems}
              onItemClick={(item) => handleItemClick(item, navigateToFolder)}
              onDelete={handleDeleteItem}
              onRename={openRenameModal}
              onNewFolder={openNewFolderModal}
              onDownload={handleDownload}
              onShare={handleShare}
              isLoading={isAnyLoading}
            />
          )}
        </>
      )}

      {/* Storage Quota Display */}
      <Box mt="lg">
        <StorageQuotaDisplay />
      </Box>

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
          {itemToDelete && (
            <ConfirmDelete
              title="Delete Item"
              text={`Are you sure you want to delete '${itemToDelete.name}'?`}
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
        currentName={itemToRename?.name || itemToRename?.display_name || ''}
        itemType={
          itemToRename?.item_type === 'folder' || itemToRename?.is_folder
            ? 'folder'
            : 'file'
        }
      />

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
                  onClick={() => handleShare(selectedItemDetails)}
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
                  onClick={() => handleDownload(selectedItemDetails)}
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
          <Box
            w="80%"
            h="calc(100vh - 80px)"
            transition="width 0.2s ease-out"
            mx="auto"
            overflow="hidden">
            <Flex h="100%" position="relative">
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

      <GoogleDriveDrawer
        isOpen={isGoogleDriveDrawerOpen}
        onClose={() => setIsGoogleDriveDrawerOpen(false)}
        currentFolderId={currentFolderId}
        onRepositoryRefresh={refreshContents}
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
