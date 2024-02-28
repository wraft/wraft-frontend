import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'theme-ui';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

import { HeadingFrame } from './Card';
import Page from './PageFrame';

interface ManageHomePage {
  sidebar?: any;
  content?: any;
}
const ManageHomePage = ({ sidebar, content }: ManageHomePage) => {
  return (
    <Page>
      <HeadingFrame title="Manage" />
      <Box variant="layout.pageFrame" sx={{ mt: 0, pt: 0 }}>
        <Flex>
          <Box>{sidebar}</Box>
          <Box>{content}</Box>
        </Flex>
        {sidebar}
      </Box>
    </Page>
  );
};

export default ManageHomePage;
