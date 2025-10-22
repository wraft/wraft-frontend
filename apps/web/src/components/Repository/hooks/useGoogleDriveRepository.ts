import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  DriveFile,
  DriveListResponse,
  listFiles,
  listFolderFiles,
  syncFiles,
} from '../components/GoogleDrive/googleDriveClient';
import { StorageItem } from '../types';
import { useRepositoryDataStore } from '../store/repositoryDataStore';

interface FolderBreadcrumb {
  id: string;
  name: string;
}

interface GoogleDriveRepositoryState {
  files: StorageItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasConnection: boolean;
  currentFolder: string | null;
  currentFolderName: string | null;
  folderStack: FolderBreadcrumb[];
  nextPageToken: string | null;
  hasMoreFiles: boolean;
}

interface GoogleDriveRepositoryActions {
  fetchFiles: (folderId?: string, pageToken?: string) => Promise<void>;
  loadMoreFiles: () => Promise<void>;
  syncFileToRepository: (
    driveFile: DriveFile,
  ) => Promise<{ success: boolean; data?: StorageItem }>;
  syncMultipleFiles: (
    driveFiles: DriveFile[],
  ) => Promise<{ success: number; failed: number; data?: StorageItem[] }>;
  navigateToFolder: (folderId: string, folderName?: string) => void;
  navigateToRoot: () => void;
  navigateBack: () => void;
}

export interface UseGoogleDriveRepositoryReturn
  extends GoogleDriveRepositoryState,
    GoogleDriveRepositoryActions {}

/**
 * Hook to manage Google Drive files in repository context
 */
export const useGoogleDriveRepository = (
  currentFolderId: string | null,
): UseGoogleDriveRepositoryReturn => {
  const [state, setState] = useState<GoogleDriveRepositoryState>({
    files: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    hasConnection: false,
    currentFolder: null,
    currentFolderName: null,
    folderStack: [],
    nextPageToken: null,
    hasMoreFiles: false,
  });

  // Get repository store actions
  const { addItem, addItems } = useRepositoryDataStore();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, hasConnection: true }));
    fetchFiles();

    return;
  }, []);

  console.log('useGoogleDriveRepository[files]', state);

  /**
   * Convert Google Drive file to StorageItem format
   */
  const convertDriveFileToStorageItem = (driveFile: DriveFile): StorageItem => {
    const isFolder =
      driveFile.mimeType === 'application/vnd.google-apps.folder';

    return {
      id: driveFile.id,
      name: driveFile.name,
      display_name: driveFile.name,
      type: isFolder ? 'folder' : 'file',
      size: driveFile.size ? parseInt(driveFile.size) : undefined,
      modified: driveFile.modifiedTime,
      path: `gdrive:/${driveFile.name}`,
      mime_type: driveFile.mimeType,
      file_extension: isFolder ? undefined : driveFile.name.split('.').pop(),
      is_folder: isFolder,
      item_type: isFolder ? 'folder' : 'file',
      status: 'google_drive',
      version: 1,
      filename: {
        file_name: driveFile.name,
        updated_at: driveFile.modifiedTime,
      },
      description: null,
      title: driveFile.name,
      metadata: {
        google_drive: true,
        web_view_link: driveFile.webViewLink,
        web_content_link: driveFile.webContentLink,
        thumbnail_link: driveFile.thumbnailLink,
        owners: driveFile.owners,
        parents: driveFile.parents,
        created_time: driveFile.createdTime,
      },
      url: driveFile.webViewLink || '',
      file_size: driveFile.size ? parseInt(driveFile.size) : 0,
      processed: false,
      version_name: null,
      storage_key: `gdrive:${driveFile.id}`,
      content_extracted: false,
      thumbnail_generated: !!driveFile.thumbnailLink,
      download_count: 0,
      last_accessed_at: null,
      inserted_at: driveFile.createdTime,
      updated_at: driveFile.modifiedTime,
      assets: driveFile.thumbnailLink
        ? [{ url: driveFile.thumbnailLink }]
        : undefined,
      repository_id: 'google_drive',
      parent_id: driveFile.parents?.[0] || undefined,
    };
  };

  const fetchFiles = useCallback(
    async (folderId?: string, pageToken?: string) => {
      setState((prev) => ({
        ...prev,
        isLoading: !pageToken, // Only show main loading for initial load
        isLoadingMore: !!pageToken, // Show loading more for pagination
        error: null,
      }));

      try {
        const options: any = {
          pageSize: 50,
          pageToken,
        };

        // If folderId is provided, use the specific folder endpoint
        if (folderId) {
          // Use the dedicated folder files endpoint
          const response: DriveListResponse = await listFolderFiles(folderId, {
            pageSize: options.pageSize,
            pageToken: options.pageToken,
          });

          const convertedFiles = response.files.map(
            convertDriveFileToStorageItem,
          );

          setState((prev) => ({
            ...prev,
            files: pageToken
              ? [...prev.files, ...convertedFiles]
              : convertedFiles,
            isLoading: false,
            isLoadingMore: false,
            currentFolder: folderId,
            currentFolderName: prev.currentFolderName, // Keep existing folder name
            nextPageToken: response.next_page_token || null,
            hasMoreFiles: !!response.next_page_token,
          }));
        } else {
          // Root folder query - exclude files that are in folders
          options.query = "'root' in parents and trashed=false";

          const response: DriveListResponse = await listFiles(options);

          const convertedFiles = response.files.map(
            convertDriveFileToStorageItem,
          );

          setState((prev) => ({
            ...prev,
            files: pageToken
              ? [...prev.files, ...convertedFiles]
              : convertedFiles,
            isLoading: false,
            isLoadingMore: false,
            currentFolder: null,
            currentFolderName: null,
            nextPageToken: response.next_page_token || null,
            hasMoreFiles: !!response.next_page_token,
          }));
        }
      } catch (error) {
        console.error('Error fetching Google Drive files:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch Google Drive files',
          isLoading: false,
          isLoadingMore: false,
        }));
      }
    },
    [],
  );

  const loadMoreFiles = useCallback(async () => {
    if (!state.nextPageToken || state.isLoadingMore) {
      return;
    }

    await fetchFiles(state.currentFolder || undefined, state.nextPageToken);
  }, [
    fetchFiles,
    state.nextPageToken,
    state.isLoadingMore,
    state.currentFolder,
  ]);

  const navigateToFolder = useCallback(
    async (folderId: string, folderName?: string) => {
      console.log('navigateToFolder', folderId, folderName);

      // Add current folder to stack before navigating (if we're not already at root)
      setState((prev) => {
        const newStack = [...prev.folderStack];

        // Only add to stack if we have a current folder (not navigating from root)
        if (prev.currentFolder && prev.currentFolderName) {
          newStack.push({
            id: prev.currentFolder,
            name: prev.currentFolderName,
          });
        }

        return {
          ...prev,
          currentFolderName: folderName || 'Unknown Folder',
          folderStack: newStack,
        };
      });

      try {
        await fetchFiles(folderId);
      } catch (error) {
        console.error('Error navigating to folder:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to navigate to folder',
          currentFolderName: null, // Reset on error
        }));
      }
    },
    [fetchFiles],
  );

  const navigateToRoot = useCallback(async () => {
    console.log('navigateToRoot');

    // Clear folder stack and pagination state when going to root
    setState((prev) => ({
      ...prev,
      folderStack: [],
      currentFolderName: null,
      nextPageToken: null,
      hasMoreFiles: false,
    }));

    try {
      await fetchFiles();
    } catch (error) {
      console.error('Error navigating to root:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to navigate to root folder',
      }));
    }
  }, [fetchFiles]);

  const navigateBack = useCallback(async () => {
    console.log('navigateBack');

    // Get current state to determine where to go back to
    const currentStack = state.folderStack;

    if (currentStack.length > 0) {
      // Navigate to parent folder
      const parentFolder = currentStack[currentStack.length - 1];
      console.log('Going back to parent folder:', parentFolder);

      // Update state to remove current folder from stack and reset pagination
      setState((prev) => ({
        ...prev,
        folderStack: prev.folderStack.slice(0, -1), // Remove last item
        currentFolderName: parentFolder.name,
        nextPageToken: null,
        hasMoreFiles: false,
      }));

      try {
        await fetchFiles(parentFolder.id);
      } catch (error) {
        console.error('Error navigating back to parent:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to navigate back',
        }));
      }
    } else {
      // No parent folder, go to root
      console.log('Going back to root');
      setState((prev) => ({
        ...prev,
        folderStack: [],
        currentFolderName: null,
        nextPageToken: null,
        hasMoreFiles: false,
      }));

      try {
        await fetchFiles(); // Go to root
      } catch (error) {
        console.error('Error navigating back to root:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to navigate back',
        }));
      }
    }
  }, [fetchFiles, state.folderStack]);

  const syncFileToRepository = useCallback(
    async (
      driveFile: DriveFile,
    ): Promise<{ success: boolean; data?: StorageItem }> => {
      // Don't sync folders
      if (driveFile.mimeType === 'application/vnd.google-apps.folder') {
        toast.error('Cannot sync folders to repository');
        return { success: false };
      }

      try {
        toast.loading(`Syncing ${driveFile.name} to repository...`);

        // Call backend API to sync the file
        const response = await syncFiles([driveFile.id], currentFolderId);

        console.log('test response', response);

        if (!response || (typeof response === 'boolean' && !response)) {
          throw new Error('Failed to sync file');
        }

        toast.dismiss();
        toast.success(`${driveFile.name} synced to repository successfully!`);

        // If response contains data, add it to the repository store
        if (
          response.storage_items &&
          Array.isArray(response.storage_items) &&
          response.storage_items.length > 0
        ) {
          const syncedItem = response.storage_items[0];
          console.log('test syncedItem', syncedItem);
          addItem(syncedItem);
          return { success: true, data: syncedItem };
        }

        return { success: true };
      } catch (error) {
        toast.dismiss();
        console.error('Error syncing file:', error);
        toast.error(
          `Failed to sync ${driveFile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        return { success: false };
      }
    },
    [currentFolderId, addItem],
  );

  const syncMultipleFiles = useCallback(
    async (
      driveFiles: DriveFile[],
    ): Promise<{ success: number; failed: number; data?: StorageItem[] }> => {
      console.log('syncMultipleFiles[driveFiles]', driveFiles);

      // Filter out folders
      const validFiles = driveFiles.filter(
        (file) => file.mimeType !== 'application/vnd.google-apps.folder',
      );
      console.log('syncMultipleFiles[validFiles]', validFiles);
      if (validFiles.length === 0) {
        toast.error('No valid files to sync');
        return { success: 0, failed: driveFiles.length };
      }

      let successCount = 0;
      let failedCount = 0;
      let syncedItems: StorageItem[] = [];

      try {
        // Extract file IDs for bulk sync
        const fileIds = validFiles.map((file) => file.id);
        console.log('syncMultipleFiles[fileIds]', validFiles);

        // Call backend API to sync multiple files
        const response = await syncFiles(fileIds, currentFolderId);
        console.log('syncMultipleFiles[response]', response);

        if (response && (response === true || response.success !== false)) {
          successCount = validFiles.length;

          // If response contains data, add items to the repository store
          if (response.storage_items && Array.isArray(response.storage_items)) {
            syncedItems = response.storage_items;
            // Use addItems for bulk import instead of adding one by one
            addItems(syncedItems);
          }
        } else {
          failedCount = validFiles.length;
        }
      } catch (error) {
        console.error('Error syncing multiple files:', error);
        failedCount = validFiles.length;
      }

      console.log('syncMultipleFiles[successCount]', successCount);

      return { success: successCount, failed: failedCount, data: syncedItems };
    },
    [currentFolderId, addItems],
  );

  return {
    ...state,
    fetchFiles,
    loadMoreFiles,
    syncFileToRepository,
    syncMultipleFiles,
    navigateToFolder,
    navigateToRoot,
    navigateBack,
  };
};
