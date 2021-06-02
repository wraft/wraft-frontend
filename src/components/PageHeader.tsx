import React from 'react';
import { Flex, Box, Text, Button } from 'theme-ui';

interface PageHeaderProps {
  children?: any;
  title: string;
}

const PageHeader = ({ title, children }: PageHeaderProps) => {
  return (
    
    <Box variant="layout.frameHeading">
      <Flex>
        <Text variant="pageheading">{title}</Text>
        {children}
      </Flex>
    </Box>
  );
};

export default PageHeader;
