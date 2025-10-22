import { useRepositoryUIStore } from '../store/repositoryUIStore';
import { useRepositoryDataStore } from '../store/repositoryDataStore';

export const useRepositoryActions = () => {
  // Modal state selectors from UI store
  const isRenameModalOpen = useRepositoryUIStore(
    (state) => state.isRenameModalOpen,
  );
  const isItemDetailsOpen = useRepositoryUIStore(
    (state) => state.isItemDetailsOpen,
  );
  const isDeleteModalOpen = useRepositoryUIStore(
    (state) => state.isDeleteModalOpen,
  );
  const isUploadModalOpen = useRepositoryUIStore(
    (state) => state.isUploadModalOpen,
  );

  // Action selectors from UI store - use individual selectors to prevent new object creation
  const openNewFolderModal = useRepositoryUIStore(
    (state) => state.openNewFolderModal,
  );
  const closeNewFolderModal = useRepositoryUIStore(
    (state) => state.closeNewFolderModal,
  );
  const openUploadModal = useRepositoryUIStore(
    (state) => state.openUploadModal,
  );
  const closeUploadModal = useRepositoryUIStore(
    (state) => state.closeUploadModal,
  );
  const openDeleteModal = useRepositoryUIStore(
    (state) => state.openDeleteModal,
  );
  const closeDeleteModal = useRepositoryUIStore(
    (state) => state.closeDeleteModal,
  );
  const openRenameModal = useRepositoryUIStore(
    (state) => state.openRenameModal,
  );
  const closeRenameModal = useRepositoryUIStore(
    (state) => state.closeRenameModal,
  );
  const closeItemDetails = useRepositoryUIStore(
    (state) => state.closeItemDetails,
  );

  // Data store actions
  const setLoading = useRepositoryDataStore((state) => state.setLoading);
  const setIsSetup = useRepositoryDataStore((state) => state.setIsSetup);
  const addItem = useRepositoryDataStore((state) => state.addItem);
  const removeItem = useRepositoryDataStore((state) => state.removeItem);

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
