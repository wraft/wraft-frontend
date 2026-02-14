import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import { VariantLine } from 'common/Atoms';
import { Variant } from 'schemas/template-filter';

interface ActiveFilterBadgeProps {
  variant: Variant;
  onDismiss: () => void;
}

const ActiveFilterBadge: React.FC<ActiveFilterBadgeProps> = ({
  variant,
  onDismiss,
}) => {
  return (
    <Box
      p="xs"
      border="border"
      borderRadius="sm"
      bg="background-secondary"
      display="inline-block">
      <Flex alignItems="center" gap="xs">
        <Flex alignItems="center" gap="xs">
          <VariantLine bg={variant.color} />
          <Text fontSize="sm">{variant.name}</Text>
          <Text color="text-secondary" fontSize="xs">
            ({variant.prefix})
          </Text>
        </Flex>
        <Box
          cursor="pointer"
          onClick={onDismiss}
          display="flex"
          alignItems="center"
          justifyContent="center"
          ml="xs">
          <X size={14} />
        </Box>
      </Flex>
    </Box>
  );
};

export default ActiveFilterBadge;
