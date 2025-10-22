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
} from '../types';

enableMapSet();

interface RepositoryDataState {
  // Core data
  items: StorageItem[];
  selectedItems: Set<string>;
  currentFolder: CurrentFolder | null;
  breadcrumbs: BreadcrumbItem[];

  // Setup and configuration
  isSetup: boolean;
  repositories: RepositoryData[];
  currentRepository: RepositoryData | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Cache
  itemCache: Map<string, StorageItemDetails>;
  folderCache: Map<string, StorageItem[]>;
}

interface RepositoryDataActions {
  // Data management
  setItems: (items: StorageItem[]) => void;
  addItem: (item: StorageItem) => void;
  addItems: (items: StorageItem[]) => void;
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
  setError: (error: string | null) => void;

  // Cache management
  cacheItem: (id: string, item: StorageItemDetails) => void;
  getCachedItem: (id: string) => StorageItemDetails | undefined;
  cacheFolder: (folderId: string, items: StorageItem[]) => void;
  getCachedFolder: (folderId: string) => StorageItem[] | undefined;
  clearCache: () => void;

  // Utility actions
  reset: () => void;
}

type RepositoryDataStore = RepositoryDataState & RepositoryDataActions;

const initialState: RepositoryDataState = {
  // Core data
  items: [],
  selectedItems: new Set(),
  currentFolder: null,
  breadcrumbs: [],

  // Setup and configuration
  isSetup: false,
  repositories: [],
  currentRepository: null,

  // Loading states
  isLoading: false,
  error: null,

  // Cache
  itemCache: new Map(),
  folderCache: new Map(),
};

export const useRepositoryDataStore = create<RepositoryDataStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // Data management
        setItems: (items) =>
          set((state) => {
            state.items = items;
          }),

        addItem: (item) =>
          set((state) => {
            state.items.push(item);
          }),

        addItems: (items) =>
          set((state) => {
            // Filter out duplicates based on item id
            const existingIds = new Set(state.items.map((item) => item.id));
            const newItems = items.filter((item) => !existingIds.has(item.id));
            state.items.push(...newItems);
          }),

        updateItem: (id, updates) =>
          set((state) => {
            const itemIndex = state.items.findIndex((item) => item.id === id);
            if (itemIndex !== -1) {
              state.items[itemIndex] = {
                ...state.items[itemIndex],
                ...updates,
              };
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

        // Selection management
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

        // Navigation
        setCurrentFolder: (folder) =>
          set((state) => {
            state.currentFolder = folder;
          }),

        setBreadcrumbs: (breadcrumbs) =>
          set((state) => {
            state.breadcrumbs = breadcrumbs;
          }),

        // Setup management
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

        // Loading states
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Cache management
        cacheItem: (id, item) =>
          set((state) => {
            state.itemCache.set(id, item);
          }),

        getCachedItem: (id) => {
          return get().itemCache.get(id);
        },

        cacheFolder: (folderId, items) =>
          set((state) => {
            state.folderCache.set(folderId, items);
          }),

        getCachedFolder: (folderId) => {
          return get().folderCache.get(folderId);
        },

        clearCache: () =>
          set((state) => {
            state.itemCache.clear();
            state.folderCache.clear();
          }),

        reset: () => set(initialState),
      })),
    ),
    {
      name: 'repository-data-store',
    },
  ),
);

// Selectors
export const useRepositoryItems = () =>
  useRepositoryDataStore((state) => state.items);

export const useSelectedItems = () =>
  useRepositoryDataStore((state) => state.selectedItems);

export const useCurrentFolder = () =>
  useRepositoryDataStore((state) => state.currentFolder);

export const useBreadcrumbs = () =>
  useRepositoryDataStore((state) => state.breadcrumbs);

export const useIsSetup = () =>
  useRepositoryDataStore((state) => state.isSetup);

export const useIsLoading = () =>
  useRepositoryDataStore((state) => state.isLoading);

export const useError = () => useRepositoryDataStore((state) => state.error);

export const useSelectedItemsCount = () =>
  useRepositoryDataStore((state) => state.selectedItems.size);

export const useIsAllSelected = () =>
  useRepositoryDataStore(
    (state) =>
      state.items.length > 0 &&
      state.items.every((item) => state.selectedItems.has(item.id)),
  );

export const useIsPartiallySelected = () =>
  useRepositoryDataStore(
    (state) =>
      state.selectedItems.size > 0 &&
      state.selectedItems.size < state.items.length,
  );

export const useSelectedItemsArray = () =>
  useRepositoryDataStore((state) =>
    state.items.filter((item) => state.selectedItems.has(item.id)),
  );
