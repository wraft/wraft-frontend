// ============================================================================
// NEW FOCUSED STORES (Use these for new development)
// ============================================================================
export * from './repositoryDataStore';
export * from './repositoryUIStore';
export * from './uploadStore';

// ============================================================================
// LEGACY STORE (Deprecated - will be removed in future version)
// ============================================================================
// @deprecated Use focused stores instead: repositoryDataStore, repositoryUIStore, uploadStore
export { useRepositoryStore } from './repositoryStore';

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
