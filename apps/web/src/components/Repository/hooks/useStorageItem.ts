import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchAPI } from 'utils/models';

interface StorageItemDetails {
  id: string;
  name: string;
  display_name: string;
  type: 'file' | 'folder';
  size: number;
  modified: string;
  path: string;
  is_folder: boolean;
  item_type: 'file' | 'folder';
  mime_type?: string;
  file_extension?: string;
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
  processed: boolean;
  version_name: string | null;
  storage_key: string | null;
  content_extracted: boolean;
  thumbnail_generated: boolean;
  download_count: number;
  last_accessed_at: string | null;
  inserted_at: string;
  updated_at: string;
  asset?: { url: string };
  repository_id?: string;
  parent_id?: string;
}

interface UseStorageItemReturn {
  item: StorageItemDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchItem: (itemId: string) => Promise<void>;
  clearItem: () => void;
}

export const useStorageItem = (): UseStorageItemReturn => {
  const [item, setItem] = useState<StorageItemDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchItem = useCallback(async (itemId: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchAPI(`storage/items/${itemId}`);

      setItem(response as StorageItemDetails);
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      setError(err.message || 'Failed to fetch item details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearItem = useCallback(() => {
    setItem(null);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    item,
    isLoading,
    error,
    fetchItem,
    clearItem,
  };
};
