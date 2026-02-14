import React from 'react';
import { Box, Flex, Text, Button } from '@wraft/ui';

import { FilterBlock } from 'common/Atoms';
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
      <Box w="25%" px="lg">
        <Flex justifyContent="space-between" mb="sm">
          <Text as="h4" fontWeight="heading" color="text-primary">
            Filter by Variant
          </Text>
        </Flex>
        <Box border="solid 1px" borderBottom="none" borderColor="border">
          <Box px="md" py="sm">
            <Text color="text-secondary">Loading filters...</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  if (variants.length === 0) {
    return (
      <Box w="25%" px="lg">
        <Flex justifyContent="space-between" mb="sm">
          <Text as="h4" fontWeight="heading" color="text-primary">
            Filter by Variant
          </Text>
        </Flex>
        <Box border="solid 1px" borderBottom="none" borderColor="border">
          <Box px="md" py="sm">
            <Text color="text-secondary">No variants available</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box w="25%" px="lg">
      <Flex justifyContent="space-between" mb="sm" alignItems="center">
        <Text as="h4" fontWeight="heading" color="text-primary">
          Filter by Variant
        </Text>
        {selectedVariantIds.length > 0 && (
          <Button size="xs" variant="secondary" onClick={onClearAll}>
            Clear
          </Button>
        )}
      </Flex>
      <Box border="solid 1px" borderBottom="none" borderColor="border">
        <Flex flexDirection="column">
          {variants.map((variant) => (
            <FilterBlock
              key={variant.id}
              title={variant.name}
              color={variant.color}
              setSelected={() => onVariantToggle(variant.id)}
              active={
                selectedVariantIds.includes(variant.id)
                  ? 'green.400'
                  : undefined
              }
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default TemplateFilterSidebar;
