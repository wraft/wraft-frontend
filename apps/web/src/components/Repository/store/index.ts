// Export new focused stores
export * from './repositoryDataStore';
export * from './repositoryUIStore';
export * from './uploadStore';

// Legacy store for backward compatibility
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
