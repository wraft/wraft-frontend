import React from 'react';
import { Flex, Box, Text } from 'theme-ui';

interface PageHeaderProps {
  children?: any;
  title: string;
  desc?: string
}

const PageHeader = ({ title, children, desc }: PageHeaderProps) => {
  return (
    
    <Box variant="layout.frameHeading">
      <Flex>
        <Box>
          <Text as="h2" variant="pageheading" sx={{ color: 'gray.7', mb: 0, fontSize: 1, fontWeight: 600 }}>{title}</Text>
          { desc && <Text as="h4" variant="pageheading" sx={{ fontSize: 0, mt: 0, color: 'gray.5', fontWeight: 400 }}>{desc}</Text> }
        </Box>
        <Box sx={{ ml: 'auto'}}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default PageHeader;
