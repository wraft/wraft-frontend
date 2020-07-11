import React from 'react';
import Head from 'next/head';
import { Box, Flex } from 'rebass';

import { useStoreState } from 'easy-peasy';
import Container from './Container';
import Sidebar from './Sidebar';
import Nav from './Nav';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
}

export const Page = (props: IPage) => {
  const showFull: boolean = props && props.showFull ? true : false;
  const token = useStoreState(state => state.auth.token);
  return (
    <>
      <Head>
        <title>Wraft Docs</title>
        <meta name="keywords" content="document,automation,proposals,sales,hr,contract management"/>
        <meta name="description" content="Wraft Docs help busines move steady and fast with Document Automation System"/>
      </Head>
      <Container width={100} bg={''}>
        {!token && (
          <Box>
            <Nav />
            <Box
              color="#333">
                {props.children}
            </Box>
          </Box>
        )}
        {token && (
          <Flex>
            <Sidebar showFull={showFull} />
            <Box width={1}>
              <Nav />
              <Box
                sx={{ minHeight: '100vh' }}
                bg="quaternary"
                color="#333"
                width={1}
                p={4}
                pt={3}
                pl={8}>
                {props.children}
              </Box>
            </Box>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default Page;
