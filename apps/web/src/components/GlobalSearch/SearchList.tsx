import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Tab,
  Box,
  Flex,
  InputText,
  Text,
  Button,
  Spinner,
  useTab,
} from '@wraft/ui';
import { SearchIcon } from '@wraft/icon';
import toast from 'react-hot-toast';

import { fetchAPI } from 'utils/models';

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
  content_type: 'Variant',
  data_template: 'Template',
  theme: 'Theme',
  layout: 'Layout',
  flow: 'Flow',
  content: 'Document',
} as const;

type CollectionType = keyof typeof COLLECTION_TITLES;

const SEARCHABLE_COLLECTIONS = [
  'content_type',
  'theme',
  'layout',
  'flow',
  'data_template',
  'content',
] as const;

const SearchList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allResults, setAllResults] = useState<SearchableDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabStore = useTab();
  const selectedTabId = tabStore.useState('selectedId');
  const selectedTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');

  useEffect(() => {
    if (isModalOpen) {
      fetchAllResults();
    }
  }, [isModalOpen]);

  const fetchAllResults = async () => {
    setIsLoading(true);
    try {
      const collectionSearchPromises = SEARCHABLE_COLLECTIONS.map(
        (collection) => searchCollection('', collection),
      );
      const collectionResults = await Promise.all(collectionSearchPromises);

      const uniqueResults = collectionResults
        .flat()
        .reduce((unique: SearchableDocument[], item) => {
          if (!unique.some((doc) => doc.id === item.id)) unique.push(item);
          return unique;
        }, []);

      setAllResults(uniqueResults);
    } catch (error) {
      toast.error(' Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery) return allResults;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return allResults.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description?.toLowerCase().includes(lowerCaseQuery),
    );
  }, [allResults, searchQuery]);

  const getCollectionResultCount = (collection: CollectionType) => {
    return filteredResults.filter((item) => item.collection_name === collection)
      .length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  const searchCollection = async (query: string, collection: string) => {
    try {
      const queryParams = `?query=${query}&collection_name=${collection}`;
      const response = (await fetchAPI(
        `search${queryParams}`,
      )) as SearchResponse;
      return response.documents || [];
    } catch (error) {
      toast.error('Failed to fetch results. Please try again later.');
      return [];
    }
  };

  const CountBadge = ({ count }: { count: number }) => (
    <Flex
      alignItems="center"
      justify="center"
      color="green.1200"
      border="1px solid"
      borderRadius="full"
      w="20px"
      h="20px"
      borderColor="gray.500"
      p="xxs"
      bg="background-secondary">
      <Text fontSize="xs" fontWeight="heading">
        {count}
      </Text>
    </Flex>
  );

  const SearchResultItem = ({ item }: { item: SearchableDocument }) => (
    <Box p="md" maxWidth="69vh" borderBottom="1px solid" borderColor="gray.500">
      <Text mt="md">{item.name}</Text>
      <Text mt="md">{item.description}</Text>
    </Box>
  );

  const CollectionTabs = () => (
    <Tab.List store={tabStore} mb="lg">
      {SEARCHABLE_COLLECTIONS.map((collection, index) => (
        <Tab key={collection} id={`tab-${index}`} store={tabStore}>
          <Flex align="center" gap="sm">
            <Text variant="lg" fontWeight="semibold">
              {COLLECTION_TITLES[collection]}
            </Text>
            <CountBadge count={getCollectionResultCount(collection)} />
          </Flex>
        </Tab>
      ))}
    </Tab.List>
  );

  return (
    <Box>
      <Box p="md">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          size="lg"
          fullWidth={true}>
          <Box>
            <SearchIcon />
          </Box>
          <Text ml="auto">⌘K</Text>
        </Button>
      </Box>

      <Modal
        ariaLabel="Search Modal"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
        <Box p="xl" mx="-5.4vh" my="-3vh">
          <Box px="xs">
            <InputText
              value={searchQuery}
              onChange={handleInputChange}
              icon={<SearchIcon />}
              iconPlacement="left"
              placeholder="Search..."
              pl="3xl"
            />
          </Box>

          <CollectionTabs />

          {isLoading ? (
            <Box alignItems="center" display="flex" justifyContent="center">
              <Spinner color="green.500" size={10} />
            </Box>
          ) : (
            <Box maxH="55vh" overflowY="auto">
              {filteredResults.length > 0 ? (
                <Box>
                  {filteredResults
                    .filter(
                      (item) =>
                        item.collection_name ===
                        SEARCHABLE_COLLECTIONS[selectedTabIndex],
                    )
                    .map((result) => (
                      <SearchResultItem key={result.id} item={result} />
                    ))}
                </Box>
              ) : (
                <Text textAlign="center" py="xl" variant="lg" color="gray.500">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : 'No items available.'}
                </Text>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default SearchList;
