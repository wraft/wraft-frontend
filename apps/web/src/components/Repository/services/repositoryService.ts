import { fetchAPI, postAPI, deleteAPI } from 'utils/models';

import { StorageItem, ApiResponse, StorageItemDetails } from '../types';

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
    return await postAPI(`storage/items/${itemId}/rename`, {
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
}
