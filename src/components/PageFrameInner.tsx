import React from 'react';
// import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';
import Head from 'next/head';
// import { useStoreState } from 'easy-peasy';
// import Container from './Container';
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

export const PageFrameInner = ({
  children,
}: // showFull = true,
// noSide = true,
IPage) => {
  // const shouldShow: boolean = showFull ? true : false;
  // const fontName = 'Poppins';
  // const url = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100;300;400;500&display=swap`;

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100%',
        }}>
        <Head>
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href={url} rel="stylesheet" /> */}

          <link
            href="https://api.fontshare.com/css?f[]=satoshi@400,500,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Flex
          sx={{
            flex: 1,
            flexDirection: ['column', 'row'],
          }}>
          <Box
            sx={{
              flex: 1,
              // bg: 'gray.1',
              minWidth: 0,
            }}>
            {children}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default PageFrameInner;
