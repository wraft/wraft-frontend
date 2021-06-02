import React from 'react';
import { Flex, Box, Text } from 'theme-ui';

interface PageHeaderProps {
  children?: any;
  title: string;
}

const PageHeader = ({ title, children }: PageHeaderProps) => {
  return (
    
    <Box variant="layout.frameHeading">
      <Flex>
        <Text variant="pageheading" sx={{ color: 'gray.7', fontWeight: 400 }}>{title}</Text>
        {children}
      </Flex>
    </Box>
  );
};

export default PageHeader;
