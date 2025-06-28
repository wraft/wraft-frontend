import { useCallback } from 'react';

import { fetchAPI } from 'utils/models';

import { StorageItemDetails } from '../types';
import { useRepositoryDataStore } from '../store/repositoryDataStore';
import { useRepositoryUIStore } from '../store/repositoryUIStore';

export const useFileDetailsConsolidated = () => {
  // Data store actions
  const { cacheItem, getCachedItem } = useRepositoryDataStore();

  // UI store actions
  const {
    selectedItemDetails,
    fileDetailsLoading,
    fileDetailsError,
    setSelectedItemDetails,
    setFileDetailsLoading,
    setFileDetailsError,
    openItemDetails,
    closeItemDetails,
  } = useRepositoryUIStore();

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
  };
};
