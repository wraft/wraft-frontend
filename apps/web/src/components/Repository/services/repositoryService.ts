import { fetchAPI, postAPI, deleteAPI, putAPI } from 'utils/models';

import { StorageItem, ApiResponse, StorageItemDetails } from '../types';
import { SearchFilters } from '../components/SearchBar';

export class RepositoryService {
  static async fetchContents(currentFolderId: string | null): Promise<{
    data: StorageItem[];
    breadcrumbs: any[];
    current_folder?: any;
  }> {
    const url = currentFolderId
      ? `storage/items?parent_id=${currentFolderId}`
      : 'storage/items';

    const response = (await fetchAPI(url)) as ApiResponse;
    return response;
  }

  static async createFolder(name: string, currentFolder: any): Promise<any> {
    const formData = new FormData();
    formData.append('folder[name]', name);
    formData.append(
      'folder[path]',
      currentFolder?.path ? `${currentFolder.path}/${name}` : `/${name}`,
    );

    if (currentFolder) {
      formData.append('folder[parent_id]', currentFolder.id);
    }

    return await postAPI('storage/folder', formData);
  }

  static async deleteItem(itemId: string): Promise<void> {
    await deleteAPI(`storage/items/${itemId}`);
  }

  static async uploadFiles(
    filesList: globalThis.File[],
    options: { migrateToWraft: boolean },
    currentFolderId: string | null,
  ): Promise<any[]> {
    const uploadPromises = filesList.map(async (file: any) => {
      const formData = new FormData();
      formData.append('file', file as Blob);
      formData.append('migrate_to_wraft', options.migrateToWraft.toString());

      if (currentFolderId) {
        formData.append('parent_id', currentFolderId);
      }

      return await postAPI('storage/assets/upload', formData);
    });

    return await Promise.all(uploadPromises);
  }

  static async renameItem(itemId: string, newName: string): Promise<any> {
    return await putAPI(`storage/items/${itemId}/rename`, {
      new_name: newName,
    });
  }

  static async getFileDetails(itemId: string): Promise<StorageItemDetails> {
    try {
      const response = await fetchAPI(`storage/items/${itemId}`);
      return response as StorageItemDetails;
    } catch (error: any) {
      // Try alternative endpoint if the first one fails
      if (error.status === 404) {
        const altResponse = await fetchAPI(`storage/assets/${itemId}`);
        return altResponse as StorageItemDetails;
      }
      throw error;
    }
  }

  static async searchItems(
    query: string,
    filters: SearchFilters,
    signal?: AbortSignal,
  ): Promise<{ items: StorageItem[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('search', query);

    // Add filters to search params
    if (filters.type && filters.type !== 'all') {
      searchParams.append('type', filters.type);
    }

    if (filters.fileType && filters.fileType !== 'all') {
      searchParams.append('file_type', filters.fileType);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      searchParams.append('date_range', filters.dateRange);
    }

    if (filters.sizeRange && filters.sizeRange !== 'all') {
      searchParams.append('size_range', filters.sizeRange);
    }

    const url = `storage/items?${searchParams.toString()}`;

    try {
      const response = (await fetchAPI(url)) as ApiResponse & {
        total?: number;
      };

      return {
        items: response.data || [],
        total: response.total || 0,
      };
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Search cancelled');
      }
      throw error;
    }
  }

  static async downloadFile(
    item: StorageItem | StorageItemDetails,
  ): Promise<void> {
    try {
      const downloadUrl = item?.asset?.url || null;

      if (!downloadUrl) {
        throw new Error('Download URL not available for this file');
      }

      const link = document.createElement('a');
      link.href = downloadUrl;

      const fileName = item.display_name || item.name || 'download';
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: Track download count by calling an API endpoint
      // await postAPI(`storage/items/${item.id}/download`);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error(
        `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
