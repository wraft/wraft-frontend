import React from 'react';
// import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';

// import { useStoreState } from 'easy-peasy';
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
          bg: 'red',
        }}>
        <Flex
          sx={{
            flex: 1,
            flexDirection: ['column', 'row'],
          }}>
          <Box
            sx={{
              flex: 1,
              bg: 'gray.1',
              minWidth: 0,
              '.ProseMirror p': {
                bg: 'base',
              },
            }}>
            {inner && <Box sx={{ minHeight: '100vh' }}>{inner}</Box>}

            {children}
            <Flex bg="gray.1" sx={{ pt: 0 }}>
              <Text sx={{ fontSize: '12px', p: 4, color: 'gray.3' }}>
                (c) Wraft Docs Inc 2021 . All Rights Reserved
              </Text>
              <Box
                sx={{
                  ml: 'auto',
                  flexDirection: ['column', 'column'],
                }}>
                <Text sx={{ fontSize: 0, p: 4, color: 'gray.5' }}>
                  Support | Contact Us
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
