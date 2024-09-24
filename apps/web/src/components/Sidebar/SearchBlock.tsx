import React from 'react';
import { Flex, Input } from 'theme-ui';
import { SearchIcon } from '@wraft/icon';

const SearchBlock = () => {
  return (
    <Flex
      sx={{
        py: 2,
        px: 2,
        border: 'solid 1px',
        borderColor: 'border',
        borderRadius: '4px',
        alignItems: 'center',
        bg: 'neutral.100',
        my: 1,
        mb: 3,
        mx: 2,
      }}>
      <SearchIcon width={26} color="#656E78" />

      <Input
        variant="small"
        placeholder="Search for docs"
        sx={{
          border: 'none',
          outline: 'none',
          borderRadius: 0,
          width: '130% !important',
          fontSize: 'sm',
          pl: 2,
          color: 'gray.600',
          '::placeholder': {
            color: 'gray.500',
          },
        }}
      />
    </Flex>
  );
};

export default SearchBlock;
