import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

export const useFolderNavigation = () => {
  const router = useRouter();
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced URL update function
  const debouncedUrlUpdate = useCallback(
    (fId: string | null) => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        if (fId) {
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                folderId: fId,
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

  const navigateToFolder = useCallback(
    (fId: string | null) => {
      debouncedUrlUpdate(fId);
    },
    [debouncedUrlUpdate],
  );

  const navigateToRoot = useCallback(() => {
    navigateToFolder(null);
  }, [navigateToFolder]);

  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, []);

  return {
    navigateToFolder,
    navigateToRoot,
  };
};
