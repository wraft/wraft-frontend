import React from 'react';
import { Text, Box } from 'theme-ui';
import { Input } from 'theme-ui';
import styled from '@emotion/styled';
// import { Input } from "@chakra-ui/core";

const SearchList = styled(Box)`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  position: absolute;
  top: -9px;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 900;
  border: solid 1px #eee;
  width: 100%;
  max-height: 200px;
  overflow: scroll;
`;

interface Props {
  suggetions?: any;
  onSearch: any;
  onSelection: any;
  placeholder?: string;
  defaultValue?: string;
  label?: string;
  name?: string;
}

const SearchInput: React.FC<Props> = ({
  suggetions,
  onSearch,
  placeholder,
  defaultValue,
  onSelection,
}) => {
  return (
    <Box>
      <Input
        placeholder={placeholder ? placeholder : ''}
        size="lg"
        id={name}
        name={name}
        defaultValue={defaultValue || ''}
        onChange={(e) => onSearch(e.currentTarget.value)}
      />
      {suggetions && (
        <Box sx={{ position: 'relative' }}>
          <SearchList sx={{ position: 'relative' }}>
            {suggetions &&
              suggetions.map((e: any) => (
                <Box variant="searchList" key={e.id}>
                  <Text onClick={() => onSelection(e)}>{e.name}</Text>
                </Box>
              ))}
          </SearchList>
        </Box>
      )}
    </Box>
  );
};

export default SearchInput;
