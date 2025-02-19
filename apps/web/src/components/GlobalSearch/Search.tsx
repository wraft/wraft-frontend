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

import { ContentTitleList } from 'common/content';
import { fetchAPI } from 'utils/models';

interface TypesenseDocument {
  id: string;
  collection_name: string;
  name: string;
  description?: string;
  color: string | number;
  slug?: string;
  creator_id: string;
  organisation_id: string;
  engine_id?: string;
  inserted_at: number;
  updated_at: number;
  height?: number;
  width?: number;
  unit?: string;
}

interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  name?: string;
  serialized: any;
}

interface IContentType {
  name: string;
  id: string;
  description: string;
  color: string;
}

interface DocumentResult {
  content: IContent;
  content_type: IContentType;
  creator?: {
    name: string;
    profile_pic: string;
  };
}

const collectionDisplayNames = {
  content_type: 'Variant',
  data_template: 'Template',
  theme: 'Theme',
  layout: 'Layout',
  flow: 'Flow',
  document: 'Document',
} as const;

type CollectionKey = keyof typeof collectionDisplayNames;

const SearchComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TypesenseDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredDocumentResults, setFilteredDocumentResults] = useState<
    DocumentResult[]
  >([]);
  const [filteredResults, setFilteredResults] = useState<TypesenseDocument[]>(
    [],
  );
  const [documentResults, setDocumentResults] = useState<DocumentResult[]>([]);

  const tabStore = useTab();
  const selectedId = tabStore.useState('selectedId');

  const collections = [
    'content_type',
    'theme',
    'layout',
    'flow',
    'data_template',
    'document',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmdPressed = e.ctrlKey || e.metaKey;
      const isKeyK = e.key === 'k';

      if (isCtrlOrCmdPressed && isKeyK) {
        e.preventDefault();
        setIsModalOpen((prevState) => !prevState);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const searchSingleCollection = async (
    searchTerm: string,
    collection: string,
  ) => {
    try {
      const queryString = `?query=${searchTerm}&collection_name=${collection}`;
      const response: any = await fetchAPI(`search${queryString}`);
      return response.documents || [];
    } catch (err) {
      console.error(`Error searching ${collection}:`, err);
      return [];
    }
  };

  const searchDocuments = async (searchTerm: string) => {
    try {
      const response: any = await fetchAPI(`contents`);
      const contents = response.contents || [];

      const filteredContents = contents.filter((document: DocumentResult) => {
        const contentName = document.content.name || '';
        const contentTypeName = document.content_type.name || '';
        const searchText = searchTerm.toLowerCase();

        return (
          contentName.toLowerCase().includes(searchText) ||
          contentTypeName.toLowerCase().includes(searchText)
        );
      });

      return filteredContents;
    } catch (err) {
      console.error('Error searching documents:', err);
      return [];
    }
  };

  const search = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const searchCollections = [
        'content_type',
        'theme',
        'layout',
        'flow',
        'data_template',
        'document',
      ];
      const searchPromises = searchCollections.map((collection) =>
        searchSingleCollection(searchTerm, collection),
      );

      const documentsPromise = searchDocuments(searchTerm);

      const [documentsResult, ...collectionResults] = await Promise.all([
        documentsPromise,
        ...searchPromises,
      ]);

      setDocumentResults(documentsResult);

      const combinedResults = collectionResults
        .flat()
        .reduce((unique: TypesenseDocument[], item) => {
          const exists = unique.find((doc) => doc.id === item.id);
          if (!exists) unique.push(item);
          return unique;
        }, []);

      setResults(combinedResults);
    } catch (err: any) {
      const errorMessage = err.message || 'Search failed';
      setError(errorMessage);
      console.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) search('');
  }, [isModalOpen]);

  useEffect(() => {
    const activeCollection =
      collections[parseInt(selectedId?.split('-')[1] || '0')];

    if (activeCollection === 'document') {
      setFilteredDocumentResults(documentResults);
      setFilteredResults([]);
    } else if (activeCollection === '') {
      setFilteredResults(results);
      setFilteredDocumentResults(documentResults);
    } else {
      setFilteredResults(
        results.filter((item) => item.collection_name === activeCollection),
      );
      setFilteredDocumentResults([]);
    }
  }, [selectedId, results, documentResults]);

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    search(newQuery);
  };

  const getResultCount = (collection: string) => {
    if (collection === 'all') {
      return results.length + documentResults.length;
    }
    if (collection === 'document') {
      return documentResults.length;
    }
    return results.filter((item) => item.collection_name === collection).length;
  };

  const CollectionTabs = () => (
    <Tab.List store={tabStore} mb="lg">
      {collections.map((collection, index) => {
        const displayName =
          collectionDisplayNames[collection as CollectionKey] || collection;
        return (
          <Tab key={collection} id={`tab-${index}`} store={tabStore}>
            <Flex align="center" gap="sm">
              <Text variant="lg" fontWeight="semibold">
                {displayName}
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
                  {getResultCount(collection)}
                </Text>
              </Flex>
            </Flex>
          </Tab>
        );
      })}
    </Tab.List>
  );

  const Hit = ({ hit }: { hit: TypesenseDocument }) => {
    return (
      <Box
        as="div"
        p="md"
        maxWidth="69vh"
        borderBottom="1px solid"
        borderColor="gray.500">
        <Text mt="md">{hit.name}</Text>
        <Text mt="md">{hit.description}</Text>
      </Box>
    );
  };

  const DocumentHit = ({ document }: { document: DocumentResult }) => {
    return (
      <NextLink href={`/documents/${document.content.id}`}>
        <Box as="div" p="md" borderBottom="1px solid" borderColor="gray.500">
          <Flex alignItems="center" gap="md">
            <ContentTitleList
              content={document.content}
              contentType={document.content_type}
            />
          </Flex>
        </Box>
      </NextLink>
    );
  };

  const renderResults = () => {
    const activeCollection =
      collections[parseInt(selectedId?.split('-')[1] || '0')];

    if (activeCollection === 'all') {
      return (
        <>
          {filteredDocumentResults.map((document) => (
            <DocumentHit key={document.content.id} document={document} />
          ))}
          {filteredResults.map((result) => (
            <Hit key={result.id} hit={result} />
          ))}
        </>
      );
    }

    if (activeCollection === 'document') {
      return documentResults.map((document) => (
        <DocumentHit key={document.content.id} document={document} />
      ));
    }

    return filteredResults.map((result) => (
      <Hit key={result.id} hit={result} />
    ));
  };

  return (
    <Box>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="secondary"
        style={{
          margin: '10px',
          width: '25vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
        }}>
        <SearchIcon />
        <Text style={{ marginLeft: 'auto' }}>⌘K</Text>
      </Button>

      <Modal
        ariaLabel="Search Modal"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
        <Box p="xl" mx="-5.4vh" my="-3vh">
          <Box px="2">
            <InputText
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
              icon={<SearchIcon />}
              iconPlacement="left"
              placeholder="Search..."
              style={{ paddingLeft: '40px' }}
            />
          </Box>

          <CollectionTabs />

          {loading ? (
            <Box alignItems="center" display="flex" justifyContent="center">
              <Spinner color="green.500" size={10} />
            </Box>
          ) : (
            <Box style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              {results.length > 0 ? (
                <Box>{renderResults()}</Box>
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

export default SearchComponent;
