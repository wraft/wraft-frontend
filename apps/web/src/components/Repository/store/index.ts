// ============================================================================
// NEW FOCUSED STORES (Use these for new development)
// ============================================================================
export * from './repositoryDataStore';
export * from './repositoryUIStore';
export * from './uploadStore';

// ============================================================================
// LEGACY STORE (Deprecated - removed)
// ============================================================================
// The legacy repositoryStore has been removed. Use focused stores instead.

// Re-export commonly used selectors for backward compatibility
export {
  useRepositoryItems,
  useSelectedItems,
  useCurrentFolder,
  useBreadcrumbs,
  useIsSetup,
  useIsLoading,
  useError,
  useSelectedItemsCount,
  useIsAllSelected,
  useIsPartiallySelected,
  useSelectedItemsArray,
} from './repositoryDataStore';

export {
  useIsNewFolderModalOpen,
  useIsUploadModalOpen,
  useIsDeleteModalOpen,
  useIsRenameModalOpen,
  useIsItemDetailsOpen,
  useItemToDelete,
  useItemToRename,
  useSelectedItemId,
  useSelectedItemDetails,
  useFileDetailsLoading,
  useFileDetailsError,
  useIsUploading,
  useUploadProgress,
} from './repositoryUIStore';

export {
  useUploadedFiles,
  useUploadOptions,
  useFileAccept,
  useMaxFileSize,
  useMaxFiles,
} from './uploadStore';
