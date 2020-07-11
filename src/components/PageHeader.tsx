import React from 'react';
import { Flex, Box, Text } from 'rebass';

interface PageHeaderProps {
  children?: any;
  title: string;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <Flex>
      <Text variant="pagetitle">{props.title}</Text>
      {props.children && (
        <Box ml="auto" mr={6}>
          {props.children}
        </Box>
      )}
    </Flex>
  );
};

export default PageHeader;
