import { useState, useEffect, useCallback } from 'react';

import {
  getStorageQuota,
  DriveStorageQuota,
} from '../components/GoogleDrive/googleDriveClient';

interface StorageQuotaState {
  quota: DriveStorageQuota | null;
  isLoading: boolean;
  error: string | null;
}

interface UseStorageQuotaReturn extends StorageQuotaState {
  fetchQuota: () => Promise<void>;
  refreshQuota: () => Promise<void>;
}

/**
 * Hook to manage Google Drive storage quota information
 */
export const useStorageQuota = (): UseStorageQuotaReturn => {
  const [state, setState] = useState<StorageQuotaState>({
    quota: null,
    isLoading: false,
    error: null,
  });

  const fetchQuota = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const quota = await getStorageQuota();
      setState((prev) => ({
        ...prev,
        quota,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching storage quota:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch storage quota',
      }));
    }
  }, []);

  const refreshQuota = useCallback(async () => {
    await fetchQuota();
  }, [fetchQuota]);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    ...state,
    fetchQuota,
    refreshQuota,
  };
};
