import { useState, useCallback, useRef } from 'react';

import { StorageItem } from '../types';
import { SearchFilters } from '../components/SearchBar';
import { RepositoryService } from '../services/repositoryService';

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: StorageItem[];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
  totalResults: number;
}

interface UseSearchReturn extends SearchState {
  search: (query: string, filters: SearchFilters) => Promise<void>;
  clearSearch: () => void;
  isSearchActive: boolean;
}

/**
 * Hook to manage search functionality for repository items
 */
export const useSearch = (): UseSearchReturn => {
  const [state, setState] = useState<SearchState>({
    query: '',
    filters: {
      type: 'all',
      fileType: 'all',
      dateRange: 'all',
      sizeRange: 'all',
    },
    results: [],
    isSearching: false,
    error: null,
    hasSearched: false,
    totalResults: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, filters: SearchFilters) => {
    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      query,
      filters,
      isSearching: true,
      error: null,
      hasSearched: true,
    }));

    try {
      const searchResults = await RepositoryService.searchItems(
        query,
        filters,
        abortControllerRef.current.signal,
      );

      // Check if the request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setState((prev) => ({
        ...prev,
        results: searchResults.items || [],
        totalResults: searchResults.total || 0,
        isSearching: false,
        error: null,
      }));
    } catch (error) {
      // Don't update state if the request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error('Search error:', error);
      setState((prev) => ({
        ...prev,
        results: [],
        totalResults: 0,
        isSearching: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      query: '',
      filters: {
        type: 'all',
        fileType: 'all',
        dateRange: 'all',
        sizeRange: 'all',
      },
      results: [],
      isSearching: false,
      error: null,
      hasSearched: false,
      totalResults: 0,
    });
  }, []);

  const isSearchActive = state.hasSearched && state.query.trim() !== '';

  return {
    ...state,
    search,
    clearSearch,
    isSearchActive,
  };
};
