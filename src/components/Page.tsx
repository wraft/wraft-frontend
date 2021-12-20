import React from 'react';
import Head from 'next/head';
import { Box, Flex } from 'theme-ui';

import { useStoreState } from 'easy-peasy';
import Container from './Container';
import Sidebar from './Sidebar';
import Nav from './Nav';
// import { Close } from 'theme-ui';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
}

export interface IAlert {
  appearance?: any;
  children: any;
}

// const AlertBlock = (props: IAlert) => {
//   console.log('props AlertBlock', props);
//   return (
//     <Box bg="primary">
//       X{props.children}
//       <Close ml="auto" mr={-2} />
//     </Box>
//   );
// };

export const Page = (props: any) => {
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Inter&display=swap" rel="stylesheet" />
      </Head>
      <Container width={100} bg={'white'}>
        {!token && (
          <Box>
            <Nav />
            <Box>{props.children}</Box>
          </Box>
        )}
        {token && (
          <Flex>
            <Sidebar showFull={showFull} />
            <Box bg="gray.0" sx={{ width: '100%', minHeight: '100vh' }}>
              <Nav />
              <Box sx={{ minHeight: '100vh', bg: 'base' }} color="#333" p={4} pt={3}>
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
