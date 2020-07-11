import React from 'react';
import { Box, Text } from 'rebass';
import Container from './Container';
import { Button } from 'theme-ui';

// import styled from 'styled-components';
// import Page from '../components/Page';

const UserHome = () => {
  return (
    <Box>
      <Box variant="hero" bg={'secondary'} pb={4}>
        <Container width={70} bg=''>
          <Box p={4} pl={0} pt={6} pb={6} >
            <Text variant="pagetitle" color="primary">Professional Document Pipelines</Text>
            <Text>Automate your document creation process</Text>
          </Box>
          <Button>Get Started</Button>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHome;
