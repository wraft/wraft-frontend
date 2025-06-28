import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { StorageItem, StorageItemDetails } from '../types';

interface RepositoryUIState {
  // Modal states
  isNewFolderModalOpen: boolean;
  isUploadModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isRenameModalOpen: boolean;
  isItemDetailsOpen: boolean;

  // Selected items for operations
  itemToDelete: StorageItem | null;
  itemToRename: StorageItem | null;
  selectedItemId: string | null;
  selectedItemDetails: StorageItemDetails | null;

  // File details state
  fileDetailsLoading: boolean;
  fileDetailsError: string | null;

  // Upload state
  isUploading: boolean;
  uploadProgress: Record<string, number>;
}

interface RepositoryUIActions {
  // Modal management
  openNewFolderModal: () => void;
  closeNewFolderModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openDeleteModal: (item: StorageItem) => void;
  closeDeleteModal: () => void;
  openRenameModal: (item: StorageItem) => void;
  closeRenameModal: () => void;
  openItemDetails: (itemId: string) => void;
  closeItemDetails: () => void;

  // Item operations
  setItemToDelete: (item: StorageItem | null) => void;
  setItemToRename: (item: StorageItem | null) => void;
  setSelectedItemId: (itemId: string | null) => void;
  setSelectedItemDetails: (details: StorageItemDetails | null) => void;

  // File details management
  setFileDetailsLoading: (loading: boolean) => void;
  setFileDetailsError: (error: string | null) => void;
  clearFileDetails: () => void;

  // Upload management
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: () => void;

  // Utility actions
  reset: () => void;
}

type RepositoryUIStore = RepositoryUIState & RepositoryUIActions;

const initialState: RepositoryUIState = {
  // Modal states
  isNewFolderModalOpen: false,
  isUploadModalOpen: false,
  isDeleteModalOpen: false,
  isRenameModalOpen: false,
  isItemDetailsOpen: false,

  // Selected items for operations
  itemToDelete: null,
  itemToRename: null,
  selectedItemId: null,
  selectedItemDetails: null,

  // File details state
  fileDetailsLoading: false,
  fileDetailsError: null,

  // Upload state
  isUploading: false,
  uploadProgress: {},
};

export const useRepositoryUIStore = create<RepositoryUIStore>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        ...initialState,

        // Modal management
        openNewFolderModal: () =>
          set((state) => {
            state.isNewFolderModalOpen = true;
          }),

        closeNewFolderModal: () =>
          set((state) => {
            state.isNewFolderModalOpen = false;
          }),

        openUploadModal: () =>
          set((state) => {
            state.isUploadModalOpen = true;
          }),

        closeUploadModal: () =>
          set((state) => {
            state.isUploadModalOpen = false;
          }),

        openDeleteModal: (item) =>
          set((state) => {
            state.isDeleteModalOpen = true;
            state.itemToDelete = item;
          }),

        closeDeleteModal: () =>
          set((state) => {
            state.isDeleteModalOpen = false;
            state.itemToDelete = null;
          }),

        openRenameModal: (item) =>
          set((state) => {
            state.isRenameModalOpen = true;
            state.itemToRename = item;
          }),

        closeRenameModal: () =>
          set((state) => {
            state.isRenameModalOpen = false;
            state.itemToRename = null;
          }),

        openItemDetails: (itemId) =>
          set((state) => {
            state.isItemDetailsOpen = true;
            state.selectedItemId = itemId;
          }),

        closeItemDetails: () =>
          set((state) => {
            state.isItemDetailsOpen = false;
            state.selectedItemId = null;
            state.selectedItemDetails = null;
          }),

        // Item operations
        setItemToDelete: (item) =>
          set((state) => {
            state.itemToDelete = item;
          }),

        setItemToRename: (item) =>
          set((state) => {
            state.itemToRename = item;
          }),

        setSelectedItemId: (itemId) =>
          set((state) => {
            state.selectedItemId = itemId;
          }),

        setSelectedItemDetails: (details) =>
          set((state) => {
            state.selectedItemDetails = details;
          }),

        // File details management
        setFileDetailsLoading: (loading) =>
          set((state) => {
            state.fileDetailsLoading = loading;
          }),

        setFileDetailsError: (error) =>
          set((state) => {
            state.fileDetailsError = error;
          }),

        clearFileDetails: () =>
          set((state) => {
            state.selectedItemDetails = null;
            state.fileDetailsLoading = false;
            state.fileDetailsError = null;
          }),

        // Upload management
        setUploading: (uploading) =>
          set((state) => {
            state.isUploading = uploading;
          }),

        setUploadProgress: (fileId, progress) =>
          set((state) => {
            state.uploadProgress[fileId] = progress;
          }),

        clearUploadProgress: () =>
          set((state) => {
            state.uploadProgress = {};
          }),

        // Utility actions
        reset: () => set(initialState),
      })),
    ),
    {
      name: 'repository-ui-store',
    },
  ),
);

// Selectors
export const useIsNewFolderModalOpen = () =>
  useRepositoryUIStore((state) => state.isNewFolderModalOpen);

export const useIsUploadModalOpen = () =>
  useRepositoryUIStore((state) => state.isUploadModalOpen);

export const useIsDeleteModalOpen = () =>
  useRepositoryUIStore((state) => state.isDeleteModalOpen);

export const useIsRenameModalOpen = () =>
  useRepositoryUIStore((state) => state.isRenameModalOpen);

export const useIsItemDetailsOpen = () =>
  useRepositoryUIStore((state) => state.isItemDetailsOpen);

export const useItemToDelete = () =>
  useRepositoryUIStore((state) => state.itemToDelete);

export const useItemToRename = () =>
  useRepositoryUIStore((state) => state.itemToRename);

export const useSelectedItemId = () =>
  useRepositoryUIStore((state) => state.selectedItemId);

export const useSelectedItemDetails = () =>
  useRepositoryUIStore((state) => state.selectedItemDetails);

export const useFileDetailsLoading = () =>
  useRepositoryUIStore((state) => state.fileDetailsLoading);

export const useFileDetailsError = () =>
  useRepositoryUIStore((state) => state.fileDetailsError);

export const useIsUploading = () =>
  useRepositoryUIStore((state) => state.isUploading);

export const useUploadProgress = () =>
  useRepositoryUIStore((state) => state.uploadProgress);
