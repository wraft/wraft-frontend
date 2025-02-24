import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
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

import { ContentTitleList } from 'common/content';
import { fetchAPI } from 'utils/models';

interface SearchableDocument {
  id: string;
  collection_name: string;
  name: string;
  description?: string;
  organisation_id: string;
}

interface ContentDetails {
  id: string;
  name?: string;
}

interface ContentTypeDetails {
  name: string;
}

interface SearchResultDocument {
  content: ContentDetails;
  content_type: ContentTypeDetails;
}

interface SearchResponse {
  documents: SearchableDocument[];
}

interface ContentsResponse {
  contents: SearchResultDocument[];
}

const COLLECTION_TITLES = {
  content_type: 'Variant',
  data_template: 'Template',
  theme: 'Theme',
  layout: 'Layout',
  flow: 'Flow',
  document: 'Document',
} as const;

type CollectionType = keyof typeof COLLECTION_TITLES;

const SEARCHABLE_COLLECTIONS = [
  'content_type',
  'theme',
  'layout',
  'flow',
  'data_template',
  'document',
] as const;

const SearchList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchableDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState<
    SearchResultDocument[]
  >([]);
  const [filteredResults, setFilteredResults] = useState<SearchableDocument[]>(
    [],
  );
  const [documentResults, setDocumentResults] = useState<
    SearchResultDocument[]
  >([]);

  const tabStore = useTab();
  const selectedTabId = tabStore.useState('selectedId');

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const isSearchHotkey =
        (event.ctrlKey || event.metaKey) && event.key === 'k';

      if (isSearchHotkey) {
        event.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  const searchCollection = async (
    query: string | number,
    collection: string | number,
  ): Promise<SearchableDocument[]> => {
    try {
      const queryParams = `?query=${query}&collection_name=${collection}`;
      const response = (await fetchAPI(
        `search${queryParams}`,
      )) as SearchResponse;
      return response.documents || [];
    } catch (error) {
      toast.error(`Failed to search ${collection}`);
      return [];
    }
  };

  const searchDocumentCollection = async (
    searchTerm: string,
  ): Promise<SearchResultDocument[]> => {
    try {
      const response = (await fetchAPI('contents')) as ContentsResponse;
      const allContents = response.contents || [];
      const searchTermLower = searchTerm.toLowerCase();

      return allContents.filter((doc: SearchResultDocument) => {
        const contentName = (doc.content.name || '').toLowerCase();
        const typeName = (doc.content_type.name || '').toLowerCase();
        return (
          contentName.includes(searchTermLower) ||
          typeName.includes(searchTermLower)
        );
      });
    } catch (error) {
      toast.error('Failed to search documents');
      return [];
    }
  };

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);

    try {
      const collectionSearchPromises = SEARCHABLE_COLLECTIONS.map(
        (collection) => searchCollection(searchTerm, collection),
      );
      const documentsPromise = searchDocumentCollection(searchTerm);

      const [documentsResult, ...collectionResults] = await Promise.all([
        documentsPromise,
        ...collectionSearchPromises,
      ]);

      setDocumentResults(documentsResult);

      const uniqueResults = collectionResults
        .flat()
        .reduce((unique: SearchableDocument[], item) => {
          const isDuplicate = unique.some((doc) => doc.id === item.id);
          if (!isDuplicate) unique.push(item);
          return unique;
        }, []);

      setSearchResults(uniqueResults);

      if (uniqueResults.length === 0 && documentsResult.length === 0) {
        toast('No results found');
      } else {
        toast.success('Search completed successfully', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Search operation failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) performSearch('');
  }, [isModalOpen]);

  useEffect(() => {
    const activeTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');
    const activeCollection = SEARCHABLE_COLLECTIONS[activeTabIndex];

    if (activeCollection === 'document') {
      setFilteredDocuments(documentResults);
      setFilteredResults([]);
    } else if (!activeCollection) {
      setFilteredResults(searchResults);
      setFilteredDocuments(documentResults);
    } else {
      setFilteredResults(
        searchResults.filter(
          (item) => item.collection_name === activeCollection,
        ),
      );
      setFilteredDocuments([]);
    }
  }, [selectedTabId, searchResults, documentResults]);

  const getCollectionResultCount = (collection: CollectionType) => {
    if (collection === 'document') {
      return documentResults.length;
    }
    return searchResults.filter((item) => item.collection_name === collection)
      .length;
  };

  const SearchResultItem = ({ item }: { item: SearchableDocument }) => (
    <Box p="md" maxWidth="69vh" borderBottom="1px solid" borderColor="gray.500">
      <Text mt="md">{item.name}</Text>
      <Text mt="md">{item.description}</Text>
    </Box>
  );

  const DocumentResultItem = ({
    document,
  }: {
    document: SearchResultDocument;
  }) => (
    <NextLink href={`/documents/${document.content.id}`}>
      <Box p="md" borderBottom="1px solid" borderColor="gray.500">
        <Flex alignItems="center" gap="md">
          <ContentTitleList
            content={document.content}
            contentType={document.content_type}
          />
        </Flex>
      </Box>
    </NextLink>
  );

  const CollectionTabs = () => (
    <Tab.List store={tabStore} mb="lg">
      {SEARCHABLE_COLLECTIONS.map((collection, index) => (
        <Tab key={collection} id={`tab-${index}`} store={tabStore}>
          <Flex align="center" gap="sm">
            <Text variant="lg" fontWeight="semibold">
              {COLLECTION_TITLES[collection]}
            </Text>
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
                {getCollectionResultCount(collection)}
              </Text>
            </Flex>
          </Flex>
        </Tab>
      ))}
    </Tab.List>
  );

  const renderSearchResults = () => {
    const activeTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');
    const activeCollection = SEARCHABLE_COLLECTIONS[activeTabIndex];

    if (activeCollection === 'document') {
      return documentResults.map((doc) => (
        <DocumentResultItem key={doc.content.id} document={doc} />
      ));
    }

    return filteredResults.map((result) => (
      <SearchResultItem key={result.id} item={result} />
    ));
  };

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
          <Box px="2">
            <InputText
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value);
                performSearch(e.currentTarget.value);
              }}
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
              {searchResults.length > 0 ? (
                <Box>{renderSearchResults()}</Box>
              ) : (
                searchQuery && (
                  <Text
                    textAlign="center"
                    py="xl"
                    variant="lg"
                    color="gray.500">
                    No results found for &quot;{searchQuery}&quot;
                  </Text>
                )
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default SearchList;
