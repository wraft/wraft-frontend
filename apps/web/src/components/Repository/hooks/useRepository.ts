import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { fetchAPI, postAPI, deleteAPI, putAPI } from 'utils/models';

import { ApiResponse } from '../types';
import { useRepositoryDataStore } from '../store/repositoryDataStore';
import { useRepositoryUIStore } from '../store/repositoryUIStore';

export const useRepository = (currentFolderId: string | null) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastFolderIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  console.log('test [currentFolderId]', currentFolderId);

  // Data store actions
  const {
    items,
    breadcrumbs,
    currentFolder,
    setItems,
    setBreadcrumbs,
    setCurrentFolder,
    setLoading,
    setError: setDataError,
    addItem,
    removeItem,
  } = useRepositoryDataStore();

  const { closeDeleteModal, closeNewFolderModal, closeUploadModal } =
    useRepositoryUIStore();

  const fetchContents = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);
      setDataError(null);
      lastFolderIdRef.current = currentFolderId;

      const url = currentFolderId
        ? `storage/items?parent_id=${currentFolderId}`
        : 'storage/items';

      const response = (await fetchAPI(url)) as ApiResponse;

      const { data, breadcrumbs: apiBreadcrumbs, current_folder } = response;

      setItems(data);
      setBreadcrumbs(apiBreadcrumbs);
      setCurrentFolder(current_folder || null);
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage =
        err instanceof Error
          ? err
          : new Error('Failed to fetch repository contents');
      setError(errorMessage);
      setDataError(errorMessage.message);
      setItems([]);
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentFolderId,
    setItems,
    setBreadcrumbs,
    setCurrentFolder,
    setDataError,
  ]);

  const createFolder = useCallback(
    async (name: string) => {
      try {
        const formData = new FormData();
        formData.append('folder[name]', name);
        formData.append(
          'folder[path]',
          currentFolder?.path ? `${currentFolder.path}/${name}` : `/${name}`,
        );

        if (currentFolder) {
          formData.append('folder[parent_id]', currentFolder.id);
        }

        const response = await postAPI('storage/folder', formData);

        await fetchContents();

        return response;
      } catch (err) {
        console.error('Error creating folder:', err);
        throw err;
      }
    },
    [currentFolder, fetchContents],
  );

  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        await deleteAPI(`storage/items/${folderId}`);
        await fetchContents();
      } catch (err) {
        console.error('Error deleting folder:', err);
        // Re-throw the error so it can be handled by the calling code
        throw err;
      }
    },
    [fetchContents],
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      try {
        await deleteAPI(`storage/items/${fileId}`);
        await fetchContents();
      } catch (err) {
        console.error('Error deleting file:', err);
        // Re-throw the error so it can be handled by the calling code
        throw err;
      }
    },
    [fetchContents],
  );

  const uploadFile = useCallback(
    async (
      filesList: globalThis.File[],
      options: { migrateToWraft: boolean },
    ) => {
      try {
        const uploadPromises = filesList.map(async (file: any) => {
          const formData = new FormData();
          formData.append('file', file as Blob);
          formData.append(
            'migrate_to_wraft',
            options.migrateToWraft.toString(),
          );

          if (currentFolderId) {
            formData.append('parent_id', currentFolderId);
          }

          const response = await postAPI('storage/assets/upload', formData);

          return response;
        });

        await Promise.all(uploadPromises);

        await fetchContents();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : new Error('An error occurred');
        setError(errorMessage);
        setDataError(errorMessage.message);
        throw err;
      }
    },
    [currentFolderId, fetchContents, setDataError],
  );

  const renameItem = useCallback(
    async (itemId: string, newName: string) => {
      try {
        const response = await putAPI(`storage/items/${itemId}/rename`, {
          new_name: newName,
        });

        if (response) {
          // Refresh the contents after successful rename
          await fetchContents();
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    [fetchContents],
  );

  // Memoized breadcrumbs fallback
  const fallbackBreadcrumbs = useMemo(() => {
    if (
      breadcrumbs.length === 0 &&
      currentFolder &&
      currentFolder.materialized_path
    ) {
      const segments = currentFolder.materialized_path
        .split('/')
        .filter(Boolean);

      // Check if the current folder name matches the last segment
      const lastSegment = segments[segments.length - 1];
      const isCurrentFolderInPath = lastSegment === currentFolder.name;

      // If the current folder is already represented in the path, don't add it again
      if (isCurrentFolderInPath && segments.length > 0) {
        // Remove the last segment since it's the current folder
        const pathSegments = segments.slice(0, -1);
        return pathSegments.map((name, idx) => {
          const path = '/' + pathSegments.slice(0, idx + 1).join('/');
          return {
            id: '', // No id available, so leave blank or try to map if you have a lookup
            name,
            path,
            materialized_path: path,
            is_folder: true,
          };
        });
      } else {
        // Include all segments including the current folder
        return segments.map((name, idx) => {
          const path = '/' + segments.slice(0, idx + 1).join('/');
          return {
            id: '', // No id available, so leave blank or try to map if you have a lookup
            name,
            path,
            materialized_path: path,
            is_folder: true,
          };
        });
      }
    }
    return breadcrumbs;
  }, [breadcrumbs, currentFolder]);

  // Memoized combined breadcrumbs that include current folder
  const combinedBreadcrumbs = useMemo(() => {
    const baseBreadcrumbs = fallbackBreadcrumbs;

    // If we have a current folder and it's not already in the breadcrumbs
    if (currentFolder && baseBreadcrumbs.length > 0) {
      const lastBreadcrumb = baseBreadcrumbs[baseBreadcrumbs.length - 1];
      const isCurrentFolderInBreadcrumbs =
        lastBreadcrumb.id === currentFolder.id ||
        lastBreadcrumb.name === currentFolder.name;

      if (!isCurrentFolderInBreadcrumbs) {
        // Add current folder to the breadcrumbs
        return [
          ...baseBreadcrumbs,
          {
            id: currentFolder.id,
            name: currentFolder.name,
            path: currentFolder.path,
            materialized_path: currentFolder.materialized_path,
            is_folder: currentFolder.is_folder,
          },
        ];
      }
    } else if (currentFolder && baseBreadcrumbs.length === 0) {
      // If no breadcrumbs at all, just return the current folder
      return [
        {
          id: currentFolder.id,
          name: currentFolder.name,
          path: currentFolder.path,
          materialized_path: currentFolder.materialized_path,
          is_folder: currentFolder.is_folder,
        },
      ];
    }

    return baseBreadcrumbs;
  }, [fallbackBreadcrumbs, currentFolder]);

  // Effect to fetch contents when folder changes
  useEffect(() => {
    fetchContents();

    // Cleanup function to abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentFolderId]);

  // Effect to update breadcrumbs with fallback
  useEffect(() => {
    if (fallbackBreadcrumbs.length > 0 && breadcrumbs.length === 0) {
      setBreadcrumbs(fallbackBreadcrumbs);
    }
  }, [fallbackBreadcrumbs, breadcrumbs.length, setBreadcrumbs]);

  return {
    // Data
    items,
    breadcrumbs: combinedBreadcrumbs,
    currentFolder,
    error,
    isLoading,

    // Operations
    createFolder,
    deleteFolder,
    deleteFile,
    uploadFile,
    renameItem,
    refreshContents: fetchContents,

    // Store actions for optimistic updates
    addItem,
    removeItem,
    setLoading,
    closeDeleteModal,
    closeNewFolderModal,
    closeUploadModal,
  };
};
