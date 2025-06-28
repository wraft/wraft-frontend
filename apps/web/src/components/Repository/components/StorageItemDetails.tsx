import React, { useMemo, useState } from 'react';
import { Box, Text, Flex, Button, Spinner, Tab, useTab } from '@wraft/ui';
import { FileText, Folder } from '@phosphor-icons/react';

import PdfViewer from 'common/PdfViewer';

import { StorageItemDetailsProps } from '../types';

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Loading state component
const LoadingState: React.FC = () => (
  <Box>
    <Flex justify="center" align="center" h="400px">
      <Spinner />
    </Flex>
  </Box>
);

// Error state component
const ErrorState: React.FC<{ error: string; onBack: () => void }> = ({
  error,
  onBack,
}) => (
  <Box>
    <Flex justify="center" align="center" h="400px" direction="column" gap="md">
      <Text color="error" fontSize="lg">
        Error loading item details
      </Text>
      <Text color="text-secondary">{error}</Text>
      <Button onClick={onBack} variant="primary">
        Go Back
      </Button>
    </Flex>
  </Box>
);

// Empty state component
const EmptyState: React.FC = () => (
  <Box>
    <Flex justify="center" align="center" h="400px">
      <Text>No item selected</Text>
    </Flex>
  </Box>
);

// Item header component - simplified since actions moved to drawer header
const ItemHeader: React.FC<{ item: any }> = ({ item }) => {
  return (
    <Flex align="center" gap="md" py="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        backgroundColor={item.is_folder ? 'primary.15' : 'secondary.15'}
        color={item.is_folder ? 'primary' : 'secondary'}
        w="40px"
        h="40px">
        {item.is_folder ? (
          <Folder size={20} weight="thin" />
        ) : (
          <FileText size={20} weight="thin" />
        )}
      </Box>
      <Box flex="1">
        <Text fontSize="md" fontWeight="medium" mb="xs">
          {item.display_name || item.name}
        </Text>
        <Text color="text-secondary" fontSize="sm">
          {item.is_folder
            ? 'Folder'
            : `${item.mime_type || 'File'} • ${formatFileSize(item.size || 0)}`}
        </Text>
      </Box>
    </Flex>
  );
};

// Tabular data component
const TabularData: React.FC<{ item: any }> = ({ item }) => {
  const tableData = useMemo(() => {
    const data = [
      { label: 'Name', value: item.display_name || item.name },
      {
        label: 'Type',
        value: item.is_folder ? 'Folder' : item.mime_type || 'File',
      },
      {
        label: 'Size',
        value: item.is_folder ? '-' : formatFileSize(item.size || 0),
      },
      { label: 'Extension', value: item.file_extension || '-' },
      { label: 'Created', value: formatDate(item.inserted_at) },
      { label: 'Modified', value: formatDate(item.updated_at) },
      {
        label: 'Last Accessed',
        value: item.last_accessed_at ? formatDate(item.last_accessed_at) : '-',
      },
      { label: 'Version', value: item.version_number?.toString() || '-' },
      { label: 'Downloads', value: item.download_count?.toString() || '0' },
      {
        label: 'Content Extracted',
        value: item.content_extracted ? 'Yes' : 'No',
      },
      {
        label: 'Current Version',
        value: item.is_current_version ? 'Yes' : 'No',
      },
      { label: 'Path', value: item.path },
      { label: 'Materialized Path', value: item.materialized_path },
    ];

    return data.filter((row) => row.value !== undefined && row.value !== null);
  }, [item]);

  return (
    <Box py="sm">
      <Box
        backgroundColor="background-secondary"
        borderRadius="md"
        overflow="hidden">
        {tableData.map((row, index) => (
          <Flex
            key={row.label}
            borderBottom={index < tableData.length - 1 ? '1px solid' : 'none'}
            borderColor="border"
            px="md"
            py="sm"
            align="center">
            <Box w="180px" flexShrink={0}>
              <Text fontSize="sm" color="text-secondary" fontWeight="medium">
                {row.label}
              </Text>
            </Box>
            <Box flex="1">
              <Text
                fontSize="sm"
                fontFamily={
                  row.label === 'Path' || row.label === 'Materialized Path'
                    ? 'monospace'
                    : 'inherit'
                }>
                {row.value}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

// Preview component with proper file handling
const PreviewView: React.FC<{ item: any }> = ({ item }) => {
  // Get the file URL from assets array
  const fileUrl = useMemo(() => {
    if (item.assets && item.assets.length > 0) {
      return item.assets[0].url;
    }
    return null;
  }, [item.assets]);

  if (!fileUrl) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="500px"
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        backgroundColor="background-secondary">
        <Text color="text-secondary">No preview URL available</Text>
      </Box>
    );
  }

  const mimeType = item.mime_type?.toLowerCase();
  const fileName = item.name?.toLowerCase();

  return (
    <Box>
      {mimeType === 'application/pdf' || fileName?.endsWith('.pdf') ? (
        <Box
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          overflow="hidden"
          h="calc(100vh - 200px)"
          display="flex"
          justifyContent="center">
          <PdfViewer url={fileUrl} />
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="500px"
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          backgroundColor="background-secondary">
          <Text color="text-secondary">
            Preview not available for this file type
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Summary view component
const SummaryView: React.FC<{ item: any }> = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement AI summary generation
      // This would typically call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      setSummary(
        'This is a sample AI-generated summary of the document. It would contain key insights and important information extracted from the content.',
      );
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box py="sm">
      <Flex direction="column" gap="md">
        <Flex justify="space-between" align="center">
          <Text fontSize="md" fontWeight="medium">
            Document Summary
          </Text>
          <Button
            variant="secondary"
            size="sm"
            loading={isGenerating}
            disabled={isGenerating}
            onClick={handleGenerateSummary}>
            Generate Summary with AI
          </Button>
        </Flex>

        {summary ? (
          <Box
            p="md"
            backgroundColor="background-secondary"
            borderRadius="md"
            border="1px solid"
            borderColor="border">
            <Text fontSize="sm" lineHeight="1.6">
              {summary}
            </Text>
          </Box>
        ) : (
          <Box
            p="md"
            backgroundColor="background-secondary"
            borderRadius="md"
            border="1px dashed"
            borderColor="border">
            <Flex direction="column" align="center" gap="sm">
              <Text color="text-secondary" textAlign="center">
                No summary generated yet
              </Text>
              <Text fontSize="sm" color="text-secondary" textAlign="center">
                Click the button above to generate an AI-powered summary of this
                document
              </Text>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export const StorageItemDetails: React.FC<StorageItemDetailsProps> = ({
  item,
  isLoading,
  error,
  onBack,
  isExpanded = false,
  // onToggleExpand,
  activeExpandedView = 'preview',
}) => {
  // Always call useTab first to maintain consistent hook order
  const tabStore = useTab({ defaultSelectedId: 'preview' });

  // Extract the actual item data from the nested structure
  const itemData = useMemo(() => {
    if (!item) return null;
    return 'data' in item ? item.data : item;
  }, [item]);

  // Early returns for different states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onBack={onBack} />;
  if (!itemData) return <EmptyState />;

  const isFile = !itemData.is_folder;
  const canPreview =
    isFile &&
    itemData.content_extracted &&
    itemData.assets &&
    itemData.assets.length > 0 &&
    itemData.assets[0].url;

  // const handleToggleExpand = () => {
  //   onToggleExpand?.();
  // };

  // If expanded, show content based on activeExpandedView
  if (isExpanded) {
    return (
      <Box>
        <ItemHeader item={itemData} />
        <Box mt="md">
          {activeExpandedView === 'preview' && <PreviewView item={itemData} />}
          {activeExpandedView === 'data' && <TabularData item={itemData} />}
          {activeExpandedView === 'summary' && <SummaryView item={itemData} />}
        </Box>
      </Box>
    );
  }

  // Normal view with default tabs
  return (
    <Box>
      <ItemHeader item={itemData} />

      <Box>
        <Tab.List store={tabStore} size="sm" mb="md">
          <Tab id="preview" store={tabStore} disabled={!canPreview}>
            Preview
          </Tab>
          <Tab id="data" store={tabStore}>
            Data
          </Tab>
          <Tab id="summary" store={tabStore}>
            Summary
          </Tab>
        </Tab.List>

        <Tab.Panel tabId="preview" store={tabStore}>
          <PreviewView item={itemData} />
        </Tab.Panel>

        <Tab.Panel tabId="data" store={tabStore}>
          <TabularData item={itemData} />
        </Tab.Panel>

        <Tab.Panel tabId="summary" store={tabStore}>
          <SummaryView item={itemData} />
        </Tab.Panel>
      </Box>
    </Box>
  );
};
