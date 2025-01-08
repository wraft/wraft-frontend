import React from 'react';
// import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';

// import Container from './Container';
// import Sidebar from './Sidebar';
// import Nav from './Nav';
// import { Close } from 'theme-ui';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
  noSide?: boolean;
  inner?: any;
}

export interface IAlert {
  appearance?: any;
  children: any;
  inner?: any;
}

export const Page = ({ children, inner }: IPage) => {
  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100%',
          // bg: 'red',
        }}>
        <Flex
          sx={{
            flex: 1,
            flexDirection: ['column', 'row'],
          }}>
          <Box
            sx={{
              flex: 1,
              bg: 'neutral.200',
              minWidth: 0,
              '.ProseMirror p': {
                // bg: 'background-primary',
                mb: 1,
                pb: 4,
              },
            }}>
            {inner && <Box sx={{ minHeight: '100vh' }}>{inner}</Box>}

            {children}
            <Flex sx={{ pt: 0 }}>
              <Text sx={{ fontSize: 'xs', p: 4, color: 'text-primary' }}>
                Wraft v0.3.0
              </Text>
              <Box
                sx={{
                  ml: 'auto',
                  flexDirection: ['column', 'column'],
                }}>
                {/* <Text sx={{ fontSize: 'xs', p: 4, color: 'text-primary' }}>
                  Support | Contact Us
                </Text> */}
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
