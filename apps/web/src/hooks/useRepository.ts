import { useState, useCallback } from 'react';

import { fetchAPI, postAPI, patchAPI, deleteAPI } from 'utils/models';

export interface RepositoryItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  updated_at?: string;
  inserted_at?: string;
}

export interface FileData {
  id: string;
  status: string;
  version: number;
  filename: {
    file_name: string;
    updated_at: string;
  };
  description: string | null;
  title: string;
  metadata: Record<string, any>;
  url: string;
  file_size: number;
  mime_type: string;
  processed: boolean;
  version_name: string | null;
  storage_key: string | null;
  content_extracted: boolean;
  thumbnail_generated: boolean;
  download_count: number;
  last_accessed_at: string | null;
  inserted_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
}

interface UseRepositoryReturn {
  // Repository items
  items: RepositoryItem[];
  isLoadingItems: boolean;
  itemsError: string | null;
  fetchItems: (path: string) => Promise<void>;

  // File data
  fileData: FileData | null;
  isLoadingFile: boolean;
  fileError: string | null;
  fetchFile: (fileId: string) => Promise<void>;

  // Actions
  uploadFile: (file: File, path: string) => Promise<void>;
  createFolder: (name: string, path: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
}

/**
 * Custom hook for handling repository operations
 * @returns Repository operations and state
 */
export const useRepository = (): UseRepositoryReturn => {
  // Repository items state
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // File data state
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  /**
   * Fetch repository items for a given path
   */
  const fetchItems = useCallback(async (path: string) => {
    try {
      setIsLoadingItems(true);
      setItemsError(null);
      const response = (await fetchAPI(
        `repositories/${path}/items`,
      )) as ApiResponse<RepositoryItem[]>;
      setItems(response.data);
    } catch (err) {
      setItemsError('Failed to load repository items. Please try again later.');
      console.error('Error fetching repository items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  /**
   * Fetch file data by ID
   */
  const fetchFile = useCallback(async (fileId: string) => {
    try {
      setIsLoadingFile(true);
      setFileError(null);
      const response = (await fetchAPI(
        `storage/items/${fileId}`,
      )) as ApiResponse<FileData>;
      setFileData(response.data);
    } catch (err) {
      setFileError('Failed to load file. Please try again later.');
      console.error('Error fetching file:', err);
    } finally {
      setIsLoadingFile(false);
    }
  }, []);

  /**
   * Upload a file to the repository
   */
  const uploadFile = useCallback(
    async (file: File, path: string) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        await postAPI('repositories/upload', formData);

        // Refresh items after upload
        await fetchItems(path);
      } catch (err) {
        console.error('Error uploading file:', err);
        throw new Error('Failed to upload file');
      }
    },
    [fetchItems],
  );

  /**
   * Create a new folder in the repository
   */
  const createFolder = useCallback(
    async (name: string, path: string) => {
      try {
        await postAPI('repositories/folders', { name, path });

        // Refresh items after creating folder
        await fetchItems(path);
      } catch (err) {
        console.error('Error creating folder:', err);
        throw new Error('Failed to create folder');
      }
    },
    [fetchItems],
  );

  /**
   * Delete an item from the repository
   */
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await deleteAPI(`repositories/items/${itemId}`);

      // Remove item from state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      throw new Error('Failed to delete item');
    }
  }, []);

  /**
   * Rename an item in the repository
   */
  const renameItem = useCallback(async (itemId: string, newName: string) => {
    try {
      await patchAPI(`repositories/items/${itemId}`, { name: newName });

      // Update item in state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, name: newName } : item,
        ),
      );
    } catch (err) {
      console.error('Error renaming item:', err);
      throw new Error('Failed to rename item');
    }
  }, []);

  return {
    // Repository items
    items,
    isLoadingItems,
    itemsError,
    fetchItems,

    // File data
    fileData,
    isLoadingFile,
    fileError,
    fetchFile,

    // Actions
    uploadFile,
    createFolder,
    deleteItem,
    renameItem,
  };
};
