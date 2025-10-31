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

  const itemToDelete = useItemToDelete();
  const itemToRename = useItemToRename();

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);

      removeItem(itemToDelete.id);

      if (
        itemToDelete.item_type === 'folder' ||
        itemToDelete.type === 'folder'
      ) {
        await deleteFolder(itemToDelete.id);
      } else {
        await deleteFile(itemToDelete.id);
      }
    } catch (err) {
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
      const tempId = `temp-${Date.now()}`;

      try {
        setLoading(true);

        const optimisticFolder: StorageItem = {
          id: tempId,
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
          asset: undefined,
        };

        addItem(optimisticFolder);

        await createFolder(data.name);
        closeNewFolderModal();
      } catch (err) {
        removeItem(tempId);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createFolder, setLoading, closeNewFolderModal, addItem, removeItem],
  );

  const handleUpload = useCallback(
    async (fileList: File[], options: { migrateToWraft: boolean }) => {
      try {
        setLoading(true);

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
          asset: undefined,
        }));

        optimisticFiles.forEach((file) => addItem(file));

        await uploadFile(fileList, options);
        closeUploadModal();
      } catch (err) {
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
