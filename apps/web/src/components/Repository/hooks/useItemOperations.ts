import { useCallback } from 'react';

import { StorageItem } from '../types';
import { useRepositoryActions } from './useRepositoryActions';

interface UseItemOperationsProps {
  createFolder: (name: string) => Promise<any>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  uploadFile: (
    filesList: globalThis.File[],
    options: { migrateToWraft: boolean },
  ) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<boolean>;
  selectedItemDetails: any;
}

export const useItemOperations = ({
  createFolder,
  deleteFolder,
  deleteFile,
  uploadFile,
  renameItem,
  selectedItemDetails,
}: UseItemOperationsProps) => {
  const {
    setLoading,
    addItem,
    removeItem,
    closeDeleteModal,
    closeNewFolderModal,
    closeUploadModal,
  } = useRepositoryActions();

  const handleDelete = useCallback(async () => {
    if (!selectedItemDetails) return;

    try {
      setLoading(true);

      // Optimistic update - immediately remove from UI
      removeItem(selectedItemDetails.id);

      if (selectedItemDetails.item_type === 'folder') {
        await deleteFolder(selectedItemDetails.id);
      } else {
        await deleteFile(selectedItemDetails.id);
      }
      // No need to call refreshContents() - deleteFolder/deleteFile handle it internally
    } catch (err) {
      // Revert optimistic update on error - convert StorageItemDetails back to StorageItem
      const storageItem: StorageItem = {
        id: selectedItemDetails.id,
        name: selectedItemDetails.name,
        display_name: selectedItemDetails.display_name,
        type: selectedItemDetails.item_type,
        size: selectedItemDetails.size,
        modified: selectedItemDetails.updated_at,
        path: selectedItemDetails.path,
        mime_type: selectedItemDetails.mime_type,
        file_extension: selectedItemDetails.file_extension,
        is_folder: selectedItemDetails.is_folder,
        item_type: selectedItemDetails.item_type,
        status: '',
        version: selectedItemDetails.version_number,
        filename: {
          file_name: selectedItemDetails.name,
          updated_at: selectedItemDetails.updated_at,
        },
        description: null,
        title: selectedItemDetails.name,
        metadata: selectedItemDetails.metadata,
        url: '',
        file_size: selectedItemDetails.size,
        processed: selectedItemDetails.content_extracted,
        version_name: null,
        storage_key: selectedItemDetails.path,
        content_extracted: selectedItemDetails.content_extracted,
        thumbnail_generated: selectedItemDetails.thumbnail_generated,
        download_count: selectedItemDetails.download_count,
        last_accessed_at: selectedItemDetails.last_accessed_at,
        inserted_at: selectedItemDetails.inserted_at,
        updated_at: selectedItemDetails.updated_at,
        assets: selectedItemDetails.assets,
        repository_id: selectedItemDetails.repository_id,
        parent_id: selectedItemDetails.parent_id || undefined,
      };
      addItem(storageItem);
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  }, [
    selectedItemDetails,
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
      if (!selectedItemDetails) return;

      const success = await renameItem(selectedItemDetails.id, newName);
      return success;
    },
    [selectedItemDetails, renameItem],
  );

  return {
    handleDelete,
    handleNewFolder,
    handleUpload,
    handleRename,
  };
};
