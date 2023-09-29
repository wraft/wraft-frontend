import React from 'react';
// import Head from 'next/head';
import { Box, Flex } from 'theme-ui';
// import Head from 'next/head';
// import { useStoreState } from 'easy-peasy';
// import Container from './Container';
import Sidebar from './Sidebar';
// import Nav from './Nav';
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
        // maxHeight: '100dvh',
        // overflow: 'none',
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
              borderColor: 'neutral.1',
              bg: 'bgWhite',
            }}>
            <Sidebar showFull={shouldShow} />
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            bg: 'bgWhite',
            minWidth: 0,
          }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page;
