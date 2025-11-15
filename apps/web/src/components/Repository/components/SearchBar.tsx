import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Text, Flex, InputText, Button, Select } from '@wraft/ui';
import {
  MagnifyingGlassIcon,
  XIcon,
  FunnelIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';

export interface SearchFilters {
  type?: 'all' | 'files' | 'folders';
  fileType?: 'all' | 'pdf' | 'doc' | 'image' | 'other';
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  sizeRange?: 'all' | 'small' | 'medium' | 'large';
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  isLoading = false,
  placeholder = 'Search files and folders...',
  className,
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    fileType: 'all',
    dateRange: 'all',
    sizeRange: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  }, [query, filters, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setFilters({
      type: 'all',
      fileType: 'all',
      dateRange: 'all',
      sizeRange: 'all',
    });
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    },
    [handleSearch, handleClear],
  );

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Auto-search when query changes (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim(), filters);
      } else if (query === '') {
        onClear();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, onSearch, onClear]);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== 'all',
  );

  return (
    <Box className={className}>
      <Flex direction="column" gap="sm">
        {/* Main search input */}
        <Flex align="center" gap="sm">
          <Box position="relative" flex="1">
            <Box bg="white">
              <InputText
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                size="sm"
                icon={
                  <IconFrame size={14} color="gray.700">
                    <MagnifyingGlassIcon width="22px" />
                  </IconFrame>
                }
                iconPlacement="right"
              />
            </Box>
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px',
                  minWidth: 'auto',
                  height: 'auto',
                }}>
                <XIcon size={14} />
              </Button>
            )}
          </Box>

          <Button
            variant={showFilters || hasActiveFilters ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoading}>
            <FunnelIcon size={16} />
            Filters
            {hasActiveFilters && <CaretDownIcon />}
          </Button>
        </Flex>

        {/* Filter options */}
        {showFilters && (
          <Box
            p="lg"
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary">
            <Flex direction="column" gap="md">
              <Text fontWeight="medium">Search Filters</Text>

              <Flex justify="space-between" align="end" pb="md">
                <Flex>
                  <Flex gap="lg" wrap="wrap">
                    {/* Item Type Filter */}
                    <Box minWidth="150px">
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="text-secondary">
                        Item Type
                      </Text>
                      <Select
                        value={filters.type}
                        onChange={(value) => updateFilter('type', value as any)}
                        options={[
                          { value: 'all', label: 'All Items' },
                          { value: 'files', label: 'Files Only' },
                          { value: 'folders', label: 'Folders Only' },
                        ]}
                        size="sm"
                      />
                    </Box>

                    {/* File Type Filter */}
                    {filters.type !== 'folders' && (
                      <Box minWidth="150px">
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="text-secondary">
                          File Type
                        </Text>
                        <Select
                          value={filters.fileType}
                          onChange={(value) =>
                            updateFilter('fileType', value as any)
                          }
                          options={[
                            { value: 'all', label: 'All Files' },
                            { value: 'pdf', label: 'PDF Files' },
                            { value: 'doc', label: 'Documents' },
                            { value: 'image', label: 'Images' },
                            { value: 'other', label: 'Other Files' },
                          ]}
                          size="sm"
                        />
                      </Box>
                    )}

                    {/* Date Range Filter */}
                    <Box minWidth="150px">
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="text-secondary">
                        Date Modified
                      </Text>
                      <Select
                        value={filters.dateRange}
                        onChange={(value) =>
                          updateFilter('dateRange', value as any)
                        }
                        options={[
                          { value: 'all', label: 'Any Time' },
                          { value: 'today', label: 'Today' },
                          { value: 'week', label: 'This Week' },
                          { value: 'month', label: 'This Month' },
                          { value: 'year', label: 'This Year' },
                        ]}
                        size="sm"
                      />
                    </Box>

                    {/* Size Range Filter */}
                    {filters.type !== 'folders' && (
                      <Box minWidth="150px">
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="text-secondary">
                          File Size
                        </Text>
                        <Select
                          value={filters.sizeRange}
                          onChange={(value) =>
                            updateFilter('sizeRange', value as any)
                          }
                          options={[
                            { value: 'all', label: 'Any Size' },
                            { value: 'small', label: 'Small (< 1MB)' },
                            { value: 'medium', label: 'Medium (1-10MB)' },
                            { value: 'large', label: 'Large (> 10MB)' },
                          ]}
                          size="sm"
                        />
                      </Box>
                    )}
                  </Flex>
                </Flex>

                {hasActiveFilters && (
                  <Flex>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFilters({
                          type: 'all',
                          fileType: 'all',
                          dateRange: 'all',
                          sizeRange: 'all',
                        })
                      }>
                      Clear Filters
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
