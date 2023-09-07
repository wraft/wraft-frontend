import React from 'react';
// import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';
// import Head from 'next/head';
// import { useStoreState } from 'easy-peasy';
// import Container from './Container';
import Sidebar from './Sidebar';
import Nav from './Nav';
// import { Close } from 'theme-ui';

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

export const Page = ({ children, showFull = true, noSide = true }: IPage) => {
  const shouldShow: boolean = showFull ? true : false;
  // const fontName = 'Poppins';
  // const url = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100;300;400;500&display=swap`;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        minHeight: '100%',
      }}>
      <Flex
        sx={{
          flex: 1,
          flexDirection: ['column', 'row'],
        }}>
        {noSide && (
          <Box
            sx={{
              flexBasis: ['auto', 245],
              minHeight: '100vh',
              borderRight: 'solid 1px',
              borderColor: '#E4E9EF',
              bg: 'white',
            }}>
            <Sidebar showFull={shouldShow} />
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            bg: 'background',
            minWidth: 0,
          }}>
          <Box>
            <Nav />
          </Box>
          {children}

          <Flex sx={{ pt: 0 }}>
            <Text sx={{ fontSize: '12px', p: 4, color: 'gray.3' }}>
              (c) Wraft Docs Inc 2021 . All Rights Reserved
            </Text>
            <Box
              sx={{
                ml: 'auto',
                flexDirection: ['column', 'column'],
              }}>
              <Text sx={{ fontSize: 0, p: 4, color: 'gray.5' }}>Support</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page;
