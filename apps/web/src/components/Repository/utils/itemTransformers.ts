import { StorageItem } from '../types';

/**
 * Utility function to convert StorageItem to a minimal listing object
 * Used when you only need basic info for listing (DRY principle)
 */
export const toMinimalItem = (item: StorageItem) => ({
  id: item.id,
  name: item.name,
  display_name: item.display_name,
  type: item.type,
  size: item.size,
  modified: item.modified,
  path: item.path,
  is_folder: item.is_folder,
  item_type: item.item_type,
  mime_type: item.mime_type,
  file_extension: item.file_extension,
});

/**
 * Utility function to convert StorageItem to a detailed object
 * Used when you need full details for operations
 */
export const toDetailedItem = (item: StorageItem) => ({
  ...item,
  // Ensure all required fields are present
  status: item.status || '',
  version: item.version || 1,
  filename: item.filename || {
    file_name: item.name,
    updated_at: item.modified,
  },
  description: item.description || null,
  title: item.title || item.name,
  metadata: item.metadata || {},
  url: item.url || '',
  file_size: item.file_size || item.size || 0,
  processed: item.processed || false,
  version_name: item.version_name || null,
  storage_key: item.storage_key || item.path,
  content_extracted: item.content_extracted || false,
  thumbnail_generated: item.thumbnail_generated || false,
  download_count: item.download_count || 0,
  last_accessed_at: item.last_accessed_at || null,
  inserted_at: item.inserted_at || item.modified,
  updated_at: item.updated_at || item.modified,
  assets: item.assets || [],
});

/**
 * Utility function to filter items by type
 */
export const filterItemsByType = (
  items: StorageItem[],
  type: 'file' | 'folder',
) => {
  return items.filter((item) => item.item_type === type);
};

/**
 * Utility function to sort items (folders first, then files)
 */
export const sortItems = (items: StorageItem[]) => {
  return [...items].sort((a, b) => {
    // Folders first
    if (a.is_folder && !b.is_folder) return -1;
    if (!a.is_folder && b.is_folder) return 1;

    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });
};
