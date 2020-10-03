import React from 'react';
import Head from 'next/head';
// import { Box, Flex } from 'rebass';

import { useStoreState } from 'easy-peasy';
import Container from './Container';
import Sidebar from './Sidebar';
import NavEdit from './NavEdit';
import Nav from './Nav';
import { Box, Flex } from 'theme-ui';

// import { ToastProvider } from 'react-toast-notifications';

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
  const showFull: boolean = props && props.showFull ? true : false;
  const token = useStoreState(state => state.auth.token);
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
        {!token && (
          <Box>
            <Nav />
            <Box>{props.children}</Box>
          </Box>
        )}
        {token && (
          <Flex>
            {/* <Sidebar showFull={showFull} /> */}
            <Box sx={{ width: '100%'}}>
              <NavEdit navtitle="Create"/>
              <Box
                sx={{ minHeight: '100vh'}}
                // bg="#F7F6F3"
                // p={4}
                // pt={3}
                pl={4}
                >
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
