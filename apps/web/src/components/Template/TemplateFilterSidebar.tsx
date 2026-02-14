import React from 'react';
import { Box, Flex, Text, Checkbox, Button } from '@wraft/ui';

import { VariantLine } from 'common/Atoms';
import { Variant } from 'schemas/template-filter';

interface TemplateFilterSidebarProps {
  variants: Variant[];
  selectedVariantIds: string[];
  onVariantToggle: (variantId: string) => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

const TemplateFilterSidebar: React.FC<TemplateFilterSidebarProps> = ({
  variants,
  selectedVariantIds,
  onVariantToggle,
  onClearAll,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box p="md" border="border" borderRadius="md" bg="background-primary">
        <Text>Loading filters...</Text>
      </Box>
    );
  }

  if (variants.length === 0) {
    return (
      <Box p="md" border="border" borderRadius="md" bg="background-primary">
        <Text>No variants available</Text>
      </Box>
    );
  }

  return (
    <Box
      p="md"
      border="border"
      borderRadius="md"
      bg="background-primary"
      width="250px"
      flexShrink={0}>
      <Flex flexDirection="column" gap="sm">
        <Box>
          <Text fontWeight="heading" fontSize="lg">
            Filters
          </Text>
          <Text color="text-secondary" fontSize="sm">
            Filter by variant
          </Text>
        </Box>

        <Flex flexDirection="column" gap="xs">
          {variants.map((variant) => (
            <Box key={variant.id}>
              <Checkbox
                checked={selectedVariantIds.includes(variant.id)}
                onChange={() => onVariantToggle(variant.id)}
                label={
                  <Flex alignItems="center" gap="sm">
                    <VariantLine bg={variant.color} />
                    <Text fontSize="sm">{variant.name}</Text>
                    <Text color="text-secondary" fontSize="xs">
                      ({variant.prefix})
                    </Text>
                  </Flex>
                }
              />
            </Box>
          ))}
        </Flex>

        {selectedVariantIds.length > 0 && (
          <Box>
            <Button variant="ghost" size="sm" onClick={onClearAll} width="100%">
              Clear all filters
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default TemplateFilterSidebar;
