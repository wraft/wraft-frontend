import React from 'react';
import { Box, Flex } from '@wraft/ui';

import Sidebar from 'components/Sidebar';
import { SidebarProvider, useSidebar } from 'contexts/SidebarContext';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
  noSide?: boolean;
}

export interface IAlert {
  appearance?: any;
  children: any;
}

const PageLayout = ({ children, noSide = true }: IPage) => {
  const { mode, isCollapsed } = useSidebar();
  const isMobile = mode === 'hidden';

  return (
    <Flex h="100vh" bg="background-secondary">
      {noSide && !isMobile && <Sidebar />}
      {isMobile && noSide && <Sidebar />}
      <Box flex={1} overflow="auto" pt={isMobile ? '48px' : 0} minWidth={0}>
        {children}
      </Box>
    </Flex>
  );
};

export const Page = ({ children, noSide = true }: IPage) => {
  return (
    <SidebarProvider>
      <PageLayout noSide={noSide}>{children}</PageLayout>
    </SidebarProvider>
  );
};

export default Page;
