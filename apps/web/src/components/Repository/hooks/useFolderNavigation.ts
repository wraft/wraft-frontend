import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

export const useFolderNavigation = () => {
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Debounced URL update function
  const debouncedUrlUpdate = useCallback(
    (folderId: string | null) => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        if (folderId) {
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                folderId,
              },
            },
            undefined,
            { shallow: true },
          );
        } else {
          const { folderId: _folderId, ...rest } = router.query;
          router.push(
            {
              pathname: router.pathname,
              query: rest,
            },
            undefined,
            { shallow: true },
          );
        }
      }, 150); // 150ms debounce for better performance
    },
    [router],
  );

  // Initialize folder ID from URL on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      const { folderId: _urlFolderId } = router.query;
      if (_urlFolderId) {
        setCurrentFolderId(_urlFolderId as string);
      } else {
        setCurrentFolderId(null);
      }
      isInitializedRef.current = true;
    }
  }, [router.query]);

  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      setCurrentFolderId(folderId);
      debouncedUrlUpdate(folderId);
    },
    [debouncedUrlUpdate],
  );

  const navigateToRoot = useCallback(() => {
    navigateToFolder(null);
  }, [navigateToFolder]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentFolderId,
    navigateToFolder,
    navigateToRoot,
  };
};
