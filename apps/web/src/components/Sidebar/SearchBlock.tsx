import React from 'react';

import { Box, Flex, Input } from 'theme-ui';

import { Search } from '../Icons';

const SearchBlock = () => {
  return (
    <Flex
      sx={{
        pt: 1,
        pb: 1,
        border: 'solid 1px',
        borderColor: 'border',
        borderRadius: '4px',
        mx: 3,
        alignItems: 'center',
        bg: 'neutral.100',
        // bg: 'backgroundGray',
        my: 1,
        mb: 3,
        input: {
          border: 'none',
          outline: 'none',
          '::placeholder': {
            color: 'gray.500',
          },
        },
      }}>
      <Box
        sx={{
          pl: 2,
          left: 1,
          top: 0,
          bottom: 0,
          svg: {
            fill: 'gray.100',
            pr: 2,
          },
        }}>
        <Search width={26} />
      </Box>
      <Input
        variant="small"
        placeholder="Search for docs"
        sx={{
          borderRadius: 0,
          width: '130% !important',
          fontSize: 2,
          pl: 2,
          color: 'gray.500',
        }}
      />
    </Flex>
  );
};

export default SearchBlock;
