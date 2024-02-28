import React from 'react';
import Head from 'next/head';
import { Box, Flex } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import Container from './Container';
// import Sidebar from './Sidebar';
import Nav from './Nav';
import NavEdit from './NavEdit';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
}

export interface IAlert {
  appearance?: any;
  children: any;
}

export const PageFull = (props: any) => {
  const { accessToken } = useAuth();

  return (
    <>
      <Head>
        <title>Wraft Docs</title>
        <meta
          name="keywords"
          content="document,automation,proposals,sales,hr,contract management"
        />
        <meta
          name="description"
          content="Wraft Docs help busines move steady and fast with Document Automation System"
        />
      </Head>
      <Container width={100} bg={''}>
        {!accessToken && (
          <Box>
            <Nav />
            <Box>{props.children}</Box>
          </Box>
        )}
        {accessToken && (
          <Flex>
            {/* <Sidebar showFull={showFull} /> */}
            <Box sx={{ width: '100%' }}>
              <NavEdit navtitle="" />
              <Box
                sx={{ minHeight: '100vh' }}
                bg="gray.0"
                // p={4}
                // pt={3}
                pl={4}>
                {props.children}
              </Box>
            </Box>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default PageFull;
