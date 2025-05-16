import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Modal,
  Tab,
  Box,
  Flex,
  InputText,
  Text,
  Spinner,
  useTab,
} from '@wraft/ui';
// import { SearchIcon } from '@wraft/icon';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

export const ModalWrapper = styled(Modal)`
  &[data-enter] {
    border-radius: 6px;
    padding: 0;
  }
  input[type='text']:focus {
    box-shadow: none;
  }
  input[type='text'] {
    font-size: 18px;
    border: none;
  }
`;

interface SearchableDocument {
  id: string;
  collection_name: string;
  name: string;
  description?: string;
  organisation_id: string;
}

interface SearchResponse {
  documents: SearchableDocument[];
}

const COLLECTION_TITLES = {
  content: 'Documents',
  content_type: 'Variants',
  data_template: 'Templates',
  theme: 'Themes',
  layout: 'Layouts',
  flow: 'Flows',
} as const;

type CollectionType = keyof typeof COLLECTION_TITLES;

const SEARCHABLE_COLLECTIONS = [
  'content',
  'content_type',
  // 'theme',
  // 'layout',
  // 'flow',
  'data_template',
] as const;

const SearchBlock: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchableDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_searchError, setSearchError] = useState<string | null>(null);

  const tabStore = useTab();
  const router = useRouter();
  const selectedTabId = tabStore.useState('selectedId');
  const selectedTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');

  // Reset search data function
  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchAllResults();
    }
  }, [isModalOpen]);

  const searchCollection = async (query: string, collection: string) => {
    try {
      const queryParams = `?query=${query}&collection_name=${collection}`;
      const response = (await fetchAPI(
        `search${queryParams}`,
      )) as SearchResponse;
      return response.documents || [];
    } catch (error) {
      console.error('Failed to fetch results. Please try again later.');
      return [];
    }
  };

  const fetchAllResults = async () => {
    setIsLoading(true);
    try {
      const collectionSearchPromises = SEARCHABLE_COLLECTIONS.map(
        (collection) => searchCollection('', collection),
      );
      const collectionResults = await Promise.all(collectionSearchPromises);

      const uniqueResults = collectionResults
        .flat()
        .reduce((unique: SearchableDocument[], item: SearchableDocument) => {
          if (!unique.some((doc) => doc.id === item.id)) unique.push(item);
          return unique;
        }, []);

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error(' Please try again later.');
      setSearchError('Unable to load search results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchAllCollections = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim() === '') {
          fetchAllResults();
          return;
        }

        setIsLoading(true);
        const searchPromises = SEARCHABLE_COLLECTIONS.map((collection) =>
          searchCollection(query, collection),
        );

        Promise.all(searchPromises)
          .then((collectionResults) => {
            const uniqueResults = collectionResults
              .flat()
              .reduce(
                (unique: SearchableDocument[], item: SearchableDocument) => {
                  if (!unique.some((doc) => doc.id === item.id))
                    unique.push(item);
                  return unique;
                },
                [],
              );

            setSearchResults(uniqueResults);
          })
          .catch(() => {
            console.error(
              'Failed to fetch search results. Please try again later.',
            );
            setSearchError(
              'Unable to load search results. Please try again later.',
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 300), // 300ms debounce delay
    [
      fetchAllResults,
      searchCollection,
      setIsLoading,
      setSearchResults,
      setSearchError,
    ],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearchAllCollections(query);
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery) return searchResults;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return searchResults.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description?.toLowerCase().includes(lowerCaseQuery),
    );
  }, [searchResults, searchQuery]);

  const getCollectionResultCount = (collection: CollectionType) => {
    return filteredResults.filter((item) => item.collection_name === collection)
      .length;
  };

  const handleSearchShortcut = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      setIsModalOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, [handleSearchShortcut]);

  const getItemRoute = (document: SearchableDocument) => {
    const collectionType = document.collection_name as CollectionType;

    switch (collectionType) {
      case 'content_type':
        return `/variants/${document.id}`;
      case 'data_template':
        return `/templates/edit/${document.id}`;
      case 'theme':
        return `/manage/themes/${document.id}`;
      case 'layout':
        return `/manage/layouts/${document.id}`;
      case 'flow':
        return `/manage/flows/${document.id}`;
      case 'content':
        return `/documents/${document.id}`;
      default:
        return '/';
    }
  };

  const handleItemClick = (document: SearchableDocument) => {
    const route = getItemRoute(document);
    setIsModalOpen(false); // Close modal after selection
    resetSearch(); // Reset search data after selection
    router.push(route);
  };

  const CountBadge = ({ count }: { count: number }) => (
    <Flex
      alignItems="center"
      justify="center"
      color="green.1200"
      border="1px solid"
      borderRadius="full"
      w="16px"
      h="16px"
      borderColor="border"
      p="xxs"
      bg="background-secondary">
      <Text fontSize="xs">{count}</Text>
    </Flex>
  );

  const SearchResultItem = ({ item }: { item: SearchableDocument }) => (
    <Box
      p="md"
      borderBottom="1px solid"
      borderColor="border"
      role="listitem"
      onClick={() => handleItemClick(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick(item);
        }
      }}
      cursor="pointer"
      transition="background-color 0.2s ease"
      tabIndex={0}>
      <Text as="h4" fontWeight="heading">
        {item.name}
      </Text>
      <Text color="text-secondary" mt="xs">
        {item.description}
      </Text>
    </Box>
  );

  const CollectionTabs = () => (
    <Tab.List store={tabStore}>
      {SEARCHABLE_COLLECTIONS.map((collection, index) => (
        <Tab key={collection} id={`tab-${index}`} store={tabStore}>
          <Flex align="center" gap="sm">
            <Text variant="lg" fontWeight="semibold">
              {COLLECTION_TITLES[collection as CollectionType]}
            </Text>
            <CountBadge
              count={getCollectionResultCount(collection as CollectionType)}
            />
          </Flex>
        </Tab>
      ))}
    </Tab.List>
  );

  return (
    <Flex w="100%">
      <Flex
        mx="lg"
        my="sm"
        px="sm"
        py="xxs"
        alignItems="center"
        gap="xs"
        border="solid 1px"
        borderColor="border"
        borderRadius="lg"
        onClick={() => setIsModalOpen(true)}
        role="button"
        w="100%"
        aria-label="Open search modal"
        color="gray.800"
        tabIndex={-1}>
        <IconFrame color="gray.700">
          <MagnifyingGlass size={14} weight="bold" />
        </IconFrame>
        <Text fontSize="sm2" color="text-secondary" pl="xs">
          Find documents..
        </Text>
        <Text
          ml="auto"
          bg="background-secondary"
          px="xs"
          py="xs"
          fontSize="xs"
          color="text-secondary">
          ⌘K
        </Text>
      </Flex>

      <ModalWrapper
        ariaLabel="Search Modal"
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetSearch();
        }}>
        <Box>
          <Box borderBottom="1px solid" color="border" position="relative">
            <InputText
              value={searchQuery}
              onChange={handleInputChange}
              icon={<MagnifyingGlass height={18} width={18} weight="bold" />}
              iconPlacement="left"
              placeholder="Find docs, actions, pipelines.."
              px="sm"
              py="xl"
            />
            {isLoading && (
              <Flex
                position="absolute"
                right="16px"
                top="0"
                bottom="0"
                alignItems="center"
                pointerEvents="none">
                <Spinner color="green.500" size={12} />
              </Flex>
            )}
          </Box>

          <CollectionTabs />

          <Box maxHeight="55vh" minHeight="200px" w="630px" overflowY="auto">
            {filteredResults.length > 0 ? (
              <Box>
                {filteredResults.filter(
                  (item) =>
                    item.collection_name ===
                    SEARCHABLE_COLLECTIONS[selectedTabIndex],
                ).length > 0 ? (
                  filteredResults
                    .filter(
                      (item) =>
                        item.collection_name ===
                        SEARCHABLE_COLLECTIONS[selectedTabIndex],
                    )
                    .map((result) => (
                      <SearchResultItem key={result.id} item={result} />
                    ))
                ) : (
                  <Text
                    textAlign="center"
                    py="xl"
                    variant="lg"
                    color="text-secondary">
                    No results found.
                  </Text>
                )}
              </Box>
            ) : (
              <Text textAlign="center" py="xl" variant="lg" color="gray.500">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : 'No items available.'}
              </Text>
            )}
          </Box>

          <Flex
            px="sm"
            py="xs"
            gap="sm"
            bg="background-secondary"
            borderTop="1px solid"
            borderColor="border">
            <Text color="text-secondary" fontSize="sm">
              ⌘K
            </Text>
            {/* <Text color="text-secondary" fontSize="sm">
              ⌘K
            </Text> */}
          </Flex>
        </Box>
      </ModalWrapper>
    </Flex>
  );
};

export default SearchBlock;
