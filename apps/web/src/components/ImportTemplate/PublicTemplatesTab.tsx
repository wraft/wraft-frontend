'use client';
import { useState, useEffect } from 'react';
import { Box, Text, Button, Flex } from '@wraft/ui';

import { Alert } from './Alert';

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
}

interface PublicTemplatesTabProps {
  templates: Template[];
  loading: boolean;
  error: string | null;
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  onFetchTemplates: () => void;
}

const PublicTemplatesTab = ({
  templates,
  loading,
  error,
  selectedTemplate,
  onTemplateSelect,
  onFetchTemplates,
}: PublicTemplatesTabProps) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Auto-fetch templates on mount
  useEffect(() => {
    if (templates.length === 0 && !loading && !error) {
      onFetchTemplates();
    }
  }, [templates.length, loading, error, onFetchTemplates]);

  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template);
  };

  const renderTemplateCard = (template: Template) => {
    const isSelected = selectedTemplate?.id === template.id;
    const isHovered = hoveredTemplate === template.id;

    return (
      <Box
        key={template.id}
        p="lg"
        border="1px solid"
        borderColor={isSelected ? 'primary' : 'border'}
        borderRadius="md"
        bg={isSelected ? 'primary.50' : 'background-primary'}
        cursor="pointer"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        transform={
          isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
        }
        boxShadow={isHovered ? 'xl' : 'sm'}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
        onClick={() => handleTemplateClick(template)}
        position="relative"
        overflow="hidden"
      >
        {/* Selection indicator */}
        {isSelected && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="3px"
            bg="primary"
            borderRadius="md md 0 0"
          />
        )}

        {/* Template thumbnail */}
        <Box
          w="100%"
          h="120px"
          bg="gray.100"
          borderRadius="sm"
          mb="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          position="relative"
        >
          {template.thumbnail_url ? (
            <img
              src={template.thumbnail_url}
              alt={template.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Text color="gray.500" fontSize="sm">
              No Preview
            </Text>
          )}

          {/* Overlay on hover */}
          {isHovered && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="black.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="opacity 0.2s ease-in-out"
            >
              <Button size="sm" variant="primary">
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Template info */}
        <Flex direction="column" gap="xs">
          <Text
            fontSize="md"
            fontWeight="heading"
            color="text-primary"
            lineHeight="tight"
          >
            {template.name}
          </Text>
          <Text
            fontSize="sm"
            color="text-secondary"
            lineHeight="relaxed"
            display="-webkit-box"
            style={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {template.description}
          </Text>
          <Flex justifyContent="space-between" alignItems="center" mt="xs">
            <Text fontSize="xs" color="text-tertiary">
              {template.file_size}
            </Text>
            {isSelected && (
              <Box
                w="8px"
                h="8px"
                bg="primary"
                borderRadius="full"
                animation="pulse 2s infinite"
              />
            )}
          </Flex>
        </Flex>
      </Box>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Box
      p="lg"
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      bg="background-primary"
      animation="pulse 2s infinite"
    >
      <Box w="100%" h="120px" bg="gray.200" borderRadius="sm" mb="md" />
      <Box h="16px" bg="gray.200" borderRadius="sm" mb="xs" />
      <Box h="14px" bg="gray.200" borderRadius="sm" mb="xs" w="80%" />
      <Box h="12px" bg="gray.200" borderRadius="sm" w="60%" />
    </Box>
  );

  if (loading) {
    return (
      <Box>
        <Box mb="lg">
          <Text fontSize="lg" fontWeight="heading" color="text-primary" mb="xs">
            Available Templates
          </Text>
          <Text fontSize="sm" color="text-secondary">
            Loading our curated collection of professional templates...
          </Text>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          gap="lg"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py="xl">
        <Alert variant="error">
          <Box textAlign="center">
            <Text mb="md">{error}</Text>
            <Button size="sm" variant="secondary" onClick={onFetchTemplates}>
              Try Again
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (templates.length === 0) {
    return (
      <Box
        textAlign="center"
        py="xl"
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        bg="background-primary"
      >
        <Text fontSize="sm" color="text-secondary" mb="md">
          No templates available at the moment.
        </Text>
        <Button size="sm" variant="secondary" onClick={onFetchTemplates}>
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb="lg">
        <Text fontSize="lg" fontWeight="heading" color="text-primary" mb="xs">
          Available Templates
        </Text>
        <Text fontSize="sm" color="text-secondary">
          Choose from our curated collection of professional templates
        </Text>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap="lg"
      >
        {templates.map(renderTemplateCard)}
      </Box>

      {selectedTemplate && (
        <Box
          mt="lg"
          p="md"
          bg="primary.50"
          borderRadius="md"
          border="1px solid"
          borderColor="primary.200"
        >
          <Flex alignItems="center" gap="md">
            <Box
              w="12px"
              h="12px"
              bg="primary"
              borderRadius="full"
              animation="pulse 2s infinite"
            />
            <Text fontSize="sm" color="primary.800" fontWeight="medium">
              Selected: {selectedTemplate.name}
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default PublicTemplatesTab;
