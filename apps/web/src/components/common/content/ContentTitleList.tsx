import React from 'react';
import { Box, Flex } from 'theme-ui';
import { Lightning } from '@phosphor-icons/react';

type Props = {
  content?: any;
  contentType?: any;
};

const ContentTitleList = ({ content, contentType }: Props) => {
  return (
    <Flex sx={{ fontSize: 'xs', ml: '-16px' }}>
      <Box
        sx={{
          width: '3px',
          bg: contentType?.color ? contentType?.color : 'blue',
        }}
      />
      <Box ml={3}>
        <Box sx={{ color: 'gray.1000' }}>{content?.instance_id}</Box>
        <Flex sx={{ alignItems: 'center', gap: '4px' }}>
          <Box
            as="h5"
            sx={{
              fontSize: 'sm',
              color: 'gray.1200',
              letterSpacing: '-0.15px',
              fontWeight: 500,
              lineHeight: 1.25,
            }}>
            {content?.serialized?.title}
          </Box>
          {content?.type === 3 && (
            <Lightning size={12} weight="bold" color="#62b997" />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ContentTitleList;
