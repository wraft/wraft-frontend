import { useCallback } from 'react';

import { StorageItem } from '../types';
import { useRepositoryActions } from './useRepositoryActions';
import { useItemToDelete, useItemToRename } from '../store/repositoryUIStore';

interface UseItemOperationsProps {
  createFolder: (name: string) => Promise<any>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  uploadFile: (
    filesList: globalThis.File[],
    options: { migrateToWraft: boolean },
  ) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<boolean>;
}

export const useItemOperations = ({
  createFolder,
  deleteFolder,
  deleteFile,
  uploadFile,
  renameItem,
}: UseItemOperationsProps) => {
  const {
    setLoading,
    addItem,
    removeItem,
    closeDeleteModal,
    closeNewFolderModal,
    closeUploadModal,
  } = useRepositoryActions();

  // Get the items from the UI store
  const itemToDelete = useItemToDelete();
  const itemToRename = useItemToRename();

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);

      // Optimistic update - immediately remove from UI
      removeItem(itemToDelete.id);

      if (
        itemToDelete.item_type === 'folder' ||
        itemToDelete.type === 'folder'
      ) {
        await deleteFolder(itemToDelete.id);
      } else {
        await deleteFile(itemToDelete.id);
      }
      // No need to call refreshContents() - deleteFolder/deleteFile handle it internally
    } catch (err) {
      // Revert optimistic update on error - add the item back
      addItem(itemToDelete);
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  }, [
    itemToDelete,
    deleteFolder,
    deleteFile,
    setLoading,
    closeDeleteModal,
    removeItem,
    addItem,
  ]);

  const handleNewFolder = useCallback(
    async (data: { name: string }, currentFolder?: any) => {
      try {
        setLoading(true);

        // Create optimistic folder item
        const optimisticFolder: StorageItem = {
          id: `temp-${Date.now()}`, // Temporary ID
          name: data.name,
          display_name: data.name,
          type: 'folder',
          size: 0,
          modified: new Date().toISOString(),
          path: currentFolder?.path
            ? `${currentFolder.path}/${data.name}`
            : `/${data.name}`,
          is_folder: true,
          item_type: 'folder',
          status: '',
          version: 1,
          filename: {
            file_name: data.name,
            updated_at: new Date().toISOString(),
          },
          description: null,
          title: data.name,
          metadata: {},
          url: '',
          file_size: 0,
          processed: false,
          version_name: null,
          storage_key: null,
          content_extracted: false,
          thumbnail_generated: false,
          download_count: 0,
          last_accessed_at: null,
          inserted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          assets: [],
        };

        // Optimistic update - immediately add to UI
        addItem(optimisticFolder);

        await createFolder(data.name);
        // No need to call refreshContents() - createFolder handles it internally
      } catch (err) {
        // Revert optimistic update on error
        removeItem(`temp-${Date.now()}`);
      } finally {
        setLoading(false);
        closeNewFolderModal();
      }
    },
    [createFolder, setLoading, closeNewFolderModal, addItem, removeItem],
  );

  const handleUpload = useCallback(
    async (fileList: File[], options: { migrateToWraft: boolean }) => {
      try {
        setLoading(true);

        // Create optimistic file items
        const optimisticFiles: StorageItem[] = fileList.map((file, index) => ({
          id: `temp-upload-${Date.now()}-${index}`,
          name: file.name,
          display_name: file.name,
          type: 'file',
          size: file.size,
          modified: new Date().toISOString(),
          path: file.name,
          is_folder: false,
          item_type: 'file',
          mime_type: file.type,
          file_extension: file.name.split('.').pop() || '',
          status: '',
          version: 1,
          filename: {
            file_name: file.name,
            updated_at: new Date().toISOString(),
          },
          description: null,
          title: file.name,
          metadata: {},
          url: '',
          file_size: file.size,
          processed: false,
          version_name: null,
          storage_key: null,
          content_extracted: false,
          thumbnail_generated: false,
          download_count: 0,
          last_accessed_at: null,
          inserted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          assets: [],
        }));

        // Optimistic update - immediately add to UI
        optimisticFiles.forEach((file) => addItem(file));

        await uploadFile(fileList, options);
        // No need to call refreshContents() - uploadFile handles it internally
        closeUploadModal();
      } catch (err) {
        // Revert optimistic updates on error
        fileList.forEach((_, index) => {
          removeItem(`temp-upload-${Date.now()}-${index}`);
        });
      } finally {
        setLoading(false);
      }
    },
    [uploadFile, setLoading, closeUploadModal, addItem, removeItem],
  );

  const handleRename = useCallback(
    async (newName: string) => {
      if (!itemToRename) return false;

      const success = await renameItem(itemToRename.id, newName);
      return success;
    },
    [itemToRename, renameItem],
  );

  return {
    handleDelete,
    handleNewFolder,
    handleUpload,
    handleRename,
  };
};
