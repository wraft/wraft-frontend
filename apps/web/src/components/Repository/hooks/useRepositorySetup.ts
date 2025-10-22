import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchAPI, putAPI } from 'utils/models';

import { useRepositoryDataStore } from '../store/repositoryDataStore';

interface RepositoryData {
  id: string;
  name: string;
  status: string;
  description: string;
  inserted_at: string;
  updated_at: string;
  organisation_id: string;
  creator_id: string;
  storage_limit: number;
  current_storage_used: number;
  item_count: number;
}

// interface RepositorySetupStatus {
//   isSetup: boolean;
//   isLoading: boolean;
//   error: string | null;
//   repositories?: RepositoryData[];
// }

interface SetupRepositoryData {
  name?: string;
  description?: string;
}

export const useRepositorySetup = () => {
  // Get store actions for syncing
  const {
    setIsSetup: setStoreIsSetup,
    setRepositories: setStoreRepositories,
    setLoading: setStoreLoading,
    setError: setStoreError,
  } = useRepositoryDataStore();

  const [isSetup, setIsSetup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const hasCheckedRef = useRef(false);

  const checkSetup = useCallback(async () => {
    if (hasCheckedRef.current) return;

    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      setStoreError(null);

      const response = (await fetchAPI('repository/check')) as {
        data: RepositoryData[];
      };
      const repositoryData = response.data;

      // Repository is set up if there are any repositories in the response
      const hasRepositories = repositoryData && repositoryData.length > 0;

      setIsSetup(hasRepositories);
      setRepositories(repositoryData || []);

      // Sync with store
      setStoreIsSetup(hasRepositories);
      setStoreRepositories(repositoryData || []);

      hasCheckedRef.current = true;
    } catch (err: any) {
      const errorMessage =
        err.message || 'Failed to check repository setup status';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  }, [setStoreLoading, setStoreError, setStoreIsSetup, setStoreRepositories]);

  const setupRepository = useCallback(
    async (data: SetupRepositoryData = {}) => {
      try {
        setIsLoading(true);
        setStoreLoading(true);
        setError(null);
        setStoreError(null);

        await putAPI('repository/setup', data);
        setIsSetup(true);
        setStoreIsSetup(true);
        hasCheckedRef.current = true;

        // Refresh the repository list after setup
        await checkSetup();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to setup repository';
        setError(errorMessage);
        setStoreError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [checkSetup, setStoreLoading, setStoreError, setStoreIsSetup],
  );

  const resetSetup = useCallback(() => {
    hasCheckedRef.current = false;
    setIsSetup(false);
    setError(null);
    setRepositories([]);
  }, []);

  // Use useEffect with proper dependency management to prevent infinite loops
  useEffect(() => {
    const initializeSetup = async () => {
      await checkSetup();
    };

    initializeSetup();
  }, []); // Empty dependency array - only run once on mount

  return {
    isSetup,
    isLoading,
    error,
    repositories,
    checkSetup,
    setupRepository,
    resetSetup,
  };
};
