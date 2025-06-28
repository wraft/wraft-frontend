import { useRepositoryStore } from '../store/repositoryStore';

export const useRepositoryActions = () => {
  // Modal state selectors
  const isRenameModalOpen = useRepositoryStore(
    (state) => state.isRenameModalOpen,
  );
  const isItemDetailsOpen = useRepositoryStore(
    (state) => state.isItemDetailsOpen,
  );
  const isDeleteModalOpen = useRepositoryStore(
    (state) => state.isDeleteModalOpen,
  );
  const isUploadModalOpen = useRepositoryStore(
    (state) => state.isUploadModalOpen,
  );

  // Action selectors - use individual selectors to prevent new object creation
  const openNewFolderModal = useRepositoryStore(
    (state) => state.openNewFolderModal,
  );
  const closeNewFolderModal = useRepositoryStore(
    (state) => state.closeNewFolderModal,
  );
  const openUploadModal = useRepositoryStore((state) => state.openUploadModal);
  const closeUploadModal = useRepositoryStore(
    (state) => state.closeUploadModal,
  );
  const openDeleteModal = useRepositoryStore((state) => state.openDeleteModal);
  const closeDeleteModal = useRepositoryStore(
    (state) => state.closeDeleteModal,
  );
  const openRenameModal = useRepositoryStore((state) => state.openRenameModal);
  const closeRenameModal = useRepositoryStore(
    (state) => state.closeRenameModal,
  );
  const closeItemDetails = useRepositoryStore(
    (state) => state.closeItemDetails,
  );
  const setLoading = useRepositoryStore((state) => state.setLoading);
  const setIsSetup = useRepositoryStore((state) => state.setIsSetup);
  const addItem = useRepositoryStore((state) => state.addItem);
  const removeItem = useRepositoryStore((state) => state.removeItem);

  return {
    // Modal states
    isRenameModalOpen,
    isItemDetailsOpen,
    isDeleteModalOpen,
    isUploadModalOpen,

    // Modal actions
    openNewFolderModal,
    closeNewFolderModal,
    openUploadModal,
    closeUploadModal,
    openDeleteModal,
    closeDeleteModal,
    openRenameModal,
    closeRenameModal,
    closeItemDetails,

    // State management
    setLoading,
    setIsSetup,
    addItem,
    removeItem,
  };
};
