import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useFileDetails } from './useFileDetails';
import { useRepositoryActions } from './useRepositoryActions';

export const useUrlSync = () => {
  const router = useRouter();
  const { openFileDetails, clearFileDetails } = useFileDetails();
  const { closeItemDetails, isItemDetailsOpen } = useRepositoryActions();

  // Sync URL with drawer state on page load
  useEffect(() => {
    const { file } = router.query;
    if (file && typeof file === 'string' && !isItemDetailsOpen) {
      openFileDetails(file);
    }
  }, [router.query.file, isItemDetailsOpen, openFileDetails]);

  // Handle route changes (back/forward navigation)
  useEffect(() => {
    const { file } = router.query;
    if (!file && isItemDetailsOpen) {
      clearFileDetails();
      closeItemDetails();
    }
  }, [
    router.query.file,
    isItemDetailsOpen,
    clearFileDetails,
    closeItemDetails,
  ]);

  const handleItemClick = useCallback(
    (item: any, navigateToFolder: (id: string) => void) => {
      if (item.is_folder) {
        navigateToFolder(item.id);
      } else {
        // Update URL to include file parameter
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, file: item.id },
          },
          undefined,
          { shallow: true },
        );
        openFileDetails(item.id);
      }
    },
    [openFileDetails, router],
  );

  const handleCloseItemDetails = useCallback(() => {
    clearFileDetails();
    closeItemDetails();
    // Remove file parameter from URL
    const { file: _file, ...queryWithoutFile } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: queryWithoutFile,
      },
      undefined,
      { shallow: true },
    );
  }, [clearFileDetails, closeItemDetails, router]);

  return {
    handleItemClick,
    handleCloseItemDetails,
  };
};
