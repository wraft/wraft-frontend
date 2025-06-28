import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';

import {
  StorageItem,
  StorageItemDetails,
  BreadcrumbItem,
  CurrentFolder,
  RepositoryData,
  UploadedFile,
  UploadOptions,
  FileValidationResult,
  DEFAULT_FILE_ACCEPT,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
} from '../types';

// Enable MapSet plugin for Immer
enableMapSet();

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface RepositoryState {
  // Core data
  items: StorageItem[];
  selectedItems: Set<string>;
  currentFolder: CurrentFolder | null;
  breadcrumbs: BreadcrumbItem[];

  // Setup and configuration
  isSetup: boolean;
  repositories: RepositoryData[];
  currentRepository: RepositoryData | null;

  // UI state
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;

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
  uploadedFiles: UploadedFile[];
  uploadOptions: UploadOptions;
  uploadProgress: Record<string, number>;

  // Configuration
  fileAccept: Record<string, string[]>;
  maxFileSize: number;
  maxFiles: number;

  // Cache
  itemCache: Map<string, StorageItemDetails>;
  folderCache: Map<string, StorageItem[]>;
}

// ============================================================================
// STORE ACTIONS INTERFACE
// ============================================================================

interface RepositoryActions {
  // Data management
  setItems: (items: StorageItem[]) => void;
  addItem: (item: StorageItem) => void;
  updateItem: (id: string, updates: Partial<StorageItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;

  // Selection management
  setSelectedItems: (itemIds: Set<string>) => void;
  selectItem: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleItemSelection: (itemId: string) => void;

  // Navigation
  setCurrentFolder: (folder: CurrentFolder | null) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;

  // Setup management
  setIsSetup: (isSetup: boolean) => void;
  setRepositories: (repositories: RepositoryData[]) => void;
  setCurrentRepository: (repository: RepositoryData | null) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;

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
  loadFileDetails: (itemId: string) => Promise<void>;
  clearFileDetails: () => void;

  // Upload management
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  clearUploadedFiles: () => void;
  setUploadOptions: (options: UploadOptions) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: () => void;

  // Configuration
  setFileAccept: (accept: Record<string, string[]>) => void;
  setMaxFileSize: (size: number) => void;
  setMaxFiles: (count: number) => void;

  // Cache management
  cacheItem: (id: string, item: StorageItemDetails) => void;
  getCachedItem: (id: string) => StorageItemDetails | undefined;
  cacheFolder: (folderId: string, items: StorageItem[]) => void;
  getCachedFolder: (folderId: string) => StorageItem[] | undefined;
  clearCache: () => void;

  // Utility actions
  reset: () => void;
  validateFile: (file: File) => FileValidationResult;
  formatFileSize: (bytes: number) => string;
}

// ============================================================================
// STORE TYPE
// ============================================================================

type RepositoryStore = RepositoryState & RepositoryActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: RepositoryState = {
  // Core data
  items: [],
  selectedItems: new Set(),
  currentFolder: null,
  breadcrumbs: [],

  // Setup and configuration
  isSetup: false,
  repositories: [],
  currentRepository: null,

  // UI state
  isLoading: false,
  isUploading: false,
  error: null,

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
  uploadedFiles: [],
  uploadOptions: { migrateToWraft: false },
  uploadProgress: {},

  // Configuration
  fileAccept: DEFAULT_FILE_ACCEPT,
  maxFileSize: DEFAULT_MAX_FILE_SIZE,
  maxFiles: DEFAULT_MAX_FILES,

  // Cache
  itemCache: new Map(),
  folderCache: new Map(),
};

// ============================================================================
// STORE CREATION
// ============================================================================

export const useRepositoryStore = create<RepositoryStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // ========================================================================
        // DATA MANAGEMENT
        // ========================================================================

        setItems: (items) =>
          set((state) => {
            state.items = items;
          }),

        addItem: (item) =>
          set((state) => {
            state.items.push(item);
          }),

        updateItem: (id, updates) =>
          set((state) => {
            const index = state.items.findIndex((item) => item.id === id);
            if (index !== -1) {
              state.items[index] = { ...state.items[index], ...updates };
            }
          }),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((item) => item.id !== id);
            state.selectedItems.delete(id);
          }),

        clearItems: () =>
          set((state) => {
            state.items = [];
            state.selectedItems.clear();
          }),

        // ========================================================================
        // SELECTION MANAGEMENT
        // ========================================================================

        setSelectedItems: (itemIds) =>
          set((state) => {
            state.selectedItems = itemIds;
          }),

        selectItem: (itemId) =>
          set((state) => {
            state.selectedItems.add(itemId);
          }),

        deselectItem: (itemId) =>
          set((state) => {
            state.selectedItems.delete(itemId);
          }),

        selectAll: () =>
          set((state) => {
            state.selectedItems = new Set(state.items.map((item) => item.id));
          }),

        deselectAll: () =>
          set((state) => {
            state.selectedItems.clear();
          }),

        toggleItemSelection: (itemId) =>
          set((state) => {
            if (state.selectedItems.has(itemId)) {
              state.selectedItems.delete(itemId);
            } else {
              state.selectedItems.add(itemId);
            }
          }),

        // ========================================================================
        // NAVIGATION
        // ========================================================================

        setCurrentFolder: (folder) =>
          set((state) => {
            state.currentFolder = folder;
          }),

        setBreadcrumbs: (breadcrumbs) =>
          set((state) => {
            state.breadcrumbs = breadcrumbs;
          }),

        // ========================================================================
        // SETUP MANAGEMENT
        // ========================================================================

        setIsSetup: (isSetup) =>
          set((state) => {
            state.isSetup = isSetup;
          }),

        setRepositories: (repositories) =>
          set((state) => {
            state.repositories = repositories;
          }),

        setCurrentRepository: (repository) =>
          set((state) => {
            state.currentRepository = repository;
          }),

        // ========================================================================
        // LOADING STATES
        // ========================================================================

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setUploading: (uploading) =>
          set((state) => {
            state.isUploading = uploading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // ========================================================================
        // MODAL MANAGEMENT
        // ========================================================================

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
            state.uploadedFiles = [];
            state.uploadProgress = {};
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

        // ========================================================================
        // ITEM OPERATIONS
        // ========================================================================

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

        // ========================================================================
        // FILE DETAILS MANAGEMENT
        // ========================================================================

        setFileDetailsLoading: (loading) =>
          set((state) => {
            state.fileDetailsLoading = loading;
          }),

        setFileDetailsError: (error) =>
          set((state) => {
            state.fileDetailsError = error;
          }),

        loadFileDetails: async (itemId) => {
          const state = get();

          // Check cache first
          const cachedItem = state.itemCache.get(itemId);
          if (cachedItem) {
            set((nstate) => {
              nstate.selectedItemDetails = cachedItem;
              nstate.fileDetailsLoading = false;
              nstate.fileDetailsError = null;
            });
            return;
          }

          // Set loading state
          set((mstate) => {
            mstate.fileDetailsLoading = true;
            mstate.fileDetailsError = null;
          });

          // Note: This function should be called from a component with access to API utilities
          // The actual API call will be handled by the component using fetchAPI from utils/models
          console.log('loadFileDetails called for itemId:', itemId);
        },

        clearFileDetails: () =>
          set((state) => {
            state.fileDetailsLoading = false;
            state.fileDetailsError = null;
          }),

        // ========================================================================
        // UPLOAD MANAGEMENT
        // ========================================================================

        setUploadedFiles: (files) =>
          set((state) => {
            state.uploadedFiles = files;
          }),

        addUploadedFile: (file) =>
          set((state) => {
            state.uploadedFiles.push(file);
          }),

        removeUploadedFile: (fileId) =>
          set((state) => {
            state.uploadedFiles = state.uploadedFiles.filter(
              (f) => f.id !== fileId,
            );
            delete state.uploadProgress[fileId];
          }),

        clearUploadedFiles: () =>
          set((state) => {
            state.uploadedFiles = [];
            state.uploadProgress = {};
          }),

        setUploadOptions: (options) =>
          set((state) => {
            state.uploadOptions = options;
          }),

        setUploadProgress: (fileId, progress) =>
          set((state) => {
            state.uploadProgress[fileId] = progress;
          }),

        clearUploadProgress: () =>
          set((state) => {
            state.uploadProgress = {};
          }),

        // ========================================================================
        // CONFIGURATION
        // ========================================================================

        setFileAccept: (accept) =>
          set((state) => {
            state.fileAccept = accept;
          }),

        setMaxFileSize: (size) =>
          set((state) => {
            state.maxFileSize = size;
          }),

        setMaxFiles: (count) =>
          set((state) => {
            state.maxFiles = count;
          }),

        // ========================================================================
        // CACHE MANAGEMENT
        // ========================================================================

        cacheItem: (id, item) =>
          set((state) => {
            state.itemCache.set(id, item);
          }),

        getCachedItem: (id) => {
          const state = get();
          return state.itemCache.get(id);
        },

        cacheFolder: (folderId, items) =>
          set((state) => {
            state.folderCache.set(folderId, items);
          }),

        getCachedFolder: (folderId) => {
          const state = get();
          return state.folderCache.get(folderId);
        },

        clearCache: () =>
          set((state) => {
            state.itemCache.clear();
            state.folderCache.clear();
          }),

        // ========================================================================
        // UTILITY ACTIONS
        // ========================================================================

        reset: () =>
          set((state) => {
            Object.assign(state, initialState);
          }),

        validateFile: (file) => {
          const state = get();

          // Check file size
          if (file.size > state.maxFileSize) {
            return {
              isValid: false,
              error: `File size exceeds maximum allowed size of ${state.formatFileSize(state.maxFileSize)}`,
            };
          }

          // Check file type
          const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
          const isValidType = Object.entries(state.fileAccept).some(
            ([mimeType, extensions]) => {
              return (
                file.type === mimeType || extensions.includes(fileExtension)
              );
            },
          );

          if (!isValidType) {
            return {
              isValid: false,
              error: `File type not supported`,
            };
          }

          return { isValid: true };
        },

        formatFileSize: (bytes) => {
          if (bytes === 0) return '0 B';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
        },
      })),
    ),
    {
      name: 'repository-store',
    },
  ),
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useRepositoryItems = () =>
  useRepositoryStore((state) => state.items);
export const useSelectedItems = () =>
  useRepositoryStore((state) => state.selectedItems);
export const useCurrentFolder = () =>
  useRepositoryStore((state) => state.currentFolder);
export const useBreadcrumbs = () =>
  useRepositoryStore((state) => state.breadcrumbs);
export const useIsSetup = () => useRepositoryStore((state) => state.isSetup);
export const useIsLoading = () =>
  useRepositoryStore((state) => state.isLoading);
export const useIsUploading = () =>
  useRepositoryStore((state) => state.isUploading);
export const useError = () => useRepositoryStore((state) => state.error);
export const useUploadedFiles = () =>
  useRepositoryStore((state) => state.uploadedFiles);
export const useUploadOptions = () =>
  useRepositoryStore((state) => state.uploadOptions);
export const useUploadProgress = () =>
  useRepositoryStore((state) => state.uploadProgress);

// Computed selectors
export const useSelectedItemsCount = () =>
  useRepositoryStore((state) => state.selectedItems.size);

export const useIsAllSelected = () =>
  useRepositoryStore(
    (state) =>
      state.items.length > 0 && state.selectedItems.size === state.items.length,
  );

export const useIsPartiallySelected = () =>
  useRepositoryStore(
    (state) =>
      state.selectedItems.size > 0 &&
      state.selectedItems.size < state.items.length,
  );

export const useSelectedItemsArray = () =>
  useRepositoryStore((state) =>
    state.items.filter((item) => state.selectedItems.has(item.id)),
  );

// File details selectors
export const useSelectedItemDetails = () =>
  useRepositoryStore((state) => state.selectedItemDetails);

export const useFileDetailsLoading = () =>
  useRepositoryStore((state) => state.fileDetailsLoading);

export const useFileDetailsError = () =>
  useRepositoryStore((state) => state.fileDetailsError);

export const useIsItemDetailsOpen = () =>
  useRepositoryStore((state) => state.isItemDetailsOpen);

// Modal state selectors
export const useIsNewFolderModalOpen = () =>
  useRepositoryStore((state) => state.isNewFolderModalOpen);

export const useIsUploadModalOpen = () =>
  useRepositoryStore((state) => state.isUploadModalOpen);

export const useIsDeleteModalOpen = () =>
  useRepositoryStore((state) => state.isDeleteModalOpen);

export const useIsRenameModalOpen = () =>
  useRepositoryStore((state) => state.isRenameModalOpen);

// ============================================================================
// ACTIONS
// ============================================================================

export const useRepositoryActions = () =>
  useRepositoryStore((state) => ({
    setItems: state.setItems,
    addItem: state.addItem,
    updateItem: state.updateItem,
    removeItem: state.removeItem,
    clearItems: state.clearItems,
    setSelectedItems: state.setSelectedItems,
    selectItem: state.selectItem,
    deselectItem: state.deselectItem,
    selectAll: state.selectAll,
    deselectAll: state.deselectAll,
    toggleItemSelection: state.toggleItemSelection,
    setCurrentFolder: state.setCurrentFolder,
    setBreadcrumbs: state.setBreadcrumbs,
    setIsSetup: state.setIsSetup,
    setLoading: state.setLoading,
    setUploading: state.setUploading,
    setError: state.setError,
    openNewFolderModal: state.openNewFolderModal,
    closeNewFolderModal: state.closeNewFolderModal,
    openUploadModal: state.openUploadModal,
    closeUploadModal: state.closeUploadModal,
    openDeleteModal: state.openDeleteModal,
    closeDeleteModal: state.closeDeleteModal,
    openRenameModal: state.openRenameModal,
    closeRenameModal: state.closeRenameModal,
    openItemDetails: state.openItemDetails,
    closeItemDetails: state.closeItemDetails,
    setUploadedFiles: state.setUploadedFiles,
    addUploadedFile: state.addUploadedFile,
    removeUploadedFile: state.removeUploadedFile,
    clearUploadedFiles: state.clearUploadedFiles,
    setUploadOptions: state.setUploadOptions,
    setUploadProgress: state.setUploadProgress,
    clearUploadProgress: state.clearUploadProgress,
    validateFile: state.validateFile,
    formatFileSize: state.formatFileSize,
    reset: state.reset,
    setFileDetailsLoading: state.setFileDetailsLoading,
    setFileDetailsError: state.setFileDetailsError,
    loadFileDetails: state.loadFileDetails,
    clearFileDetails: state.clearFileDetails,
  }));
