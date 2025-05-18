import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Lightning } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';

type Props = {
  content?: any;
  contentType?: any;
  showId?: boolean;
};

const ContentTitleList = ({ content, contentType, showId = true }: Props) => {
  return (
    <Flex fontSize="sm">
      <Box w="2px" bg={contentType?.color ? contentType?.color : 'blue'} />
      <Box ml="sm">
        {showId && (
          <Text
            as="span"
            color="text-secondary"
            fontSize="sm"
            lineHeight={'1rem'}>
            {content?.instance_id}
          </Text>
        )}

        <Flex alignItems="center" gap="xs">
          <Text fontSize="base" fontWeight={500} color="gray.1200">
            {content?.serialized?.title}
          </Text>
          {content?.type === 3 && (
            <IconFrame color="teal.300">
              <Lightning size={12} weight="fill" />
            </IconFrame>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ContentTitleList;
