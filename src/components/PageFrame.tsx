import React from 'react';
// import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';

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

  return (
    <>
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
          <Box
            sx={{
              flex: 1,
              bg: 'gray.1',
              minWidth: 0,
            }}>
            <Box>
              <Nav />
            </Box>
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
                  Support
                </Text>
              </Box>
            </Flex>
          </Box>
          {noSide && (
            <Box
              sx={{
                flexBasis: ['auto', 200],
                order: -1,
                pt: 2,
                minHeight: '100vh',
                bg: 'gray.0',
                borderRight: 'solid 1px',
                borderColor: 'gray.2',
              }}>
              <Sidebar showFull={shouldShow} />
            </Box>
          )}
        </Flex>
      </Flex>

      {/* <Container width={100} bg={'white'}>
        {!token && (
          <Box>
            <Nav />
            <Box>{props.children}</Box>
          </Box>
        )}
        {token && (
          <Flex>
            <Sidebar showFull={showFull} />
            <Box bg="gray.0" sx={{ width: '100%' }}>
              <Nav />
              <Box sx={{ minHeight: '100vh' }} color="#333" p={4} pt={3}>
                {props.children}
              </Box>
            </Box>
          </Flex>
        )}
      </Container> */}
    </>
  );
};

export default Page;
