import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchAPI, putAPI } from 'utils/models';

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
  const [isSetup, setIsSetup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const hasCheckedRef = useRef(false);

  const checkSetup = useCallback(async () => {
    if (hasCheckedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = (await fetchAPI('repository/check')) as {
        data: RepositoryData[];
      };
      const repositoryData = response.data;

      // Repository is set up if there are any repositories in the response
      const hasRepositories = repositoryData && repositoryData.length > 0;

      setIsSetup(hasRepositories);
      setRepositories(repositoryData || []);
      hasCheckedRef.current = true;
    } catch (err: any) {
      setError(err.message || 'Failed to check repository setup status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupRepository = useCallback(
    async (data: SetupRepositoryData = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        await putAPI('repository/setup', data);
        setIsSetup(true);
        hasCheckedRef.current = true;

        // Refresh the repository list after setup
        await checkSetup();
      } catch (err: any) {
        setError(err.message || 'Failed to setup repository');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [checkSetup],
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
