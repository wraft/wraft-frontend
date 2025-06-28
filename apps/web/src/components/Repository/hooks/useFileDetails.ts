import { useCallback } from 'react';

import { fetchAPI } from 'utils/models';

import { StorageItemDetails } from '../types';
import { useRepositoryStore } from '../store/repositoryStore';

export const useFileDetails = () => {
  // Zustand selectors
  const selectedItemDetails = useRepositoryStore(
    (state) => state.selectedItemDetails,
  );
  const fileDetailsLoading = useRepositoryStore(
    (state) => state.fileDetailsLoading,
  );
  const fileDetailsError = useRepositoryStore(
    (state) => state.fileDetailsError,
  );
  const itemCache = useRepositoryStore((state) => state.itemCache);

  // Zustand actions
  const setFileDetailsLoading = useRepositoryStore(
    (state) => state.setFileDetailsLoading,
  );
  const setFileDetailsError = useRepositoryStore(
    (state) => state.setFileDetailsError,
  );
  const setSelectedItemDetails = useRepositoryStore(
    (state) => state.setSelectedItemDetails,
  );
  const cacheItem = useRepositoryStore((state) => state.cacheItem);
  const getCachedItem = useRepositoryStore((state) => state.getCachedItem);
  const openItemDetails = useRepositoryStore((state) => state.openItemDetails);
  const closeItemDetails = useRepositoryStore(
    (state) => state.closeItemDetails,
  );

  const loadFileDetails = useCallback(
    async (itemId: string) => {
      // Check cache first
      const cachedItem = getCachedItem(itemId);
      if (cachedItem) {
        setSelectedItemDetails(cachedItem);
        setFileDetailsLoading(false);
        setFileDetailsError(null);
        return cachedItem;
      }

      // Set loading state
      setFileDetailsLoading(true);
      setFileDetailsError(null);

      try {
        // Fetch file details from API
        const response = await fetchAPI(`storage/items/${itemId}`);
        const fileDetails = response as StorageItemDetails;

        // Cache the result
        cacheItem(itemId, fileDetails);
        setSelectedItemDetails(fileDetails);
        setFileDetailsLoading(false);
        setFileDetailsError(null);

        return fileDetails;
      } catch (error: any) {
        // Try alternative endpoint if the first one fails
        if (error.status === 404) {
          try {
            const altResponse = await fetchAPI(`storage/assets/${itemId}`);
            const altFileDetails = altResponse as StorageItemDetails;

            cacheItem(itemId, altFileDetails);
            setSelectedItemDetails(altFileDetails);
            setFileDetailsLoading(false);
            setFileDetailsError(null);

            return altFileDetails;
          } catch (altError: any) {
            setFileDetailsLoading(false);
            setFileDetailsError(
              altError.message || 'Failed to load file details',
            );
            setSelectedItemDetails(null);
            throw altError;
          }
        }

        setFileDetailsLoading(false);
        setFileDetailsError(error.message || 'Failed to load file details');
        setSelectedItemDetails(null);
        throw error;
      }
    },
    [
      getCachedItem,
      setSelectedItemDetails,
      setFileDetailsLoading,
      setFileDetailsError,
      cacheItem,
    ],
  );

  const openFileDetails = useCallback(
    async (itemId: string) => {
      openItemDetails(itemId);
      await loadFileDetails(itemId);
    },
    [openItemDetails, loadFileDetails],
  );

  const clearFileDetails = useCallback(() => {
    closeItemDetails();
    setSelectedItemDetails(null);
    setFileDetailsLoading(false);
    setFileDetailsError(null);
  }, [
    closeItemDetails,
    setSelectedItemDetails,
    setFileDetailsLoading,
    setFileDetailsError,
  ]);

  return {
    selectedItemDetails,
    fileDetailsLoading,
    fileDetailsError,
    loadFileDetails,
    openFileDetails,
    clearFileDetails,
    itemCache,
  };
};
