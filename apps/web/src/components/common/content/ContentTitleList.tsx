import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Lightning } from '@phosphor-icons/react';

type Props = {
  content?: any;
  contentType?: any;
};

const ContentTitleList = ({ content, contentType }: Props) => {
  return (
    <Flex fontSize="sm">
      <Box w="2px" bg={contentType?.color ? contentType?.color : 'blue'} />
      <Box ml="sm">
        <Text color="text-secondary" fontSize="sm">
          {content?.instance_id}
        </Text>
        <Flex alignItems="center" gap="xs">
          <Text fontWeight="heading">{content?.serialized?.title}</Text>
          {content?.type === 3 && (
            <Lightning size={12} weight="bold" color="#62b997" />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ContentTitleList;
