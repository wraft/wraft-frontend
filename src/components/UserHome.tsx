import React from 'react';
import { Box, Text } from 'theme-ui';
import Container from './Container';
import { Button, Grid } from 'theme-ui';

// import styled from 'styled-components';
// import Page from '../components/Page';

export interface TextBlockProps {
  title: string;
  body: string;
}

const TextBlock = ({ title, body }: TextBlockProps) => {
  return (
    <Box sx={{ p: 5}}>
      <Text as="h3" sx={{ fontSize: 3, fontWeight: 600, color: 'gray.9'}}>{title}</Text>
      <Text as="p" sx={{ fontSize: 3, color: 'gray.6'}}>{body}</Text>
    </Box>
  );
};

const UserHome = () => {
  return (
    <Box bg="gray.0">
      <Box variant="hero" pb={4} sx={{ pb: 6}}>
        <Container width={70} bg='' sx={{ mb: 6}}>
          <Box p={4} pl={0} pt={6} pb={3}>
            <Text as="h1" variant="pagetitle" sx={{ fontSize: 5, fontWeight: 600, color: 'gray.9' }}>
              Professional Document Pipelines            
            </Text>
            <Text as="h2" sx={{ fontWeight: 300, fontSize: 4, color: 'gray.6' }} >Automate your document creation process</Text>
          </Box>
          <Button sx={{ mb: 5}}>Get Started</Button>
        </Container>        
      </Box>
      <Box sx={{ pt: 5, bg: 'gray.0'}}>
        <Container width={70} bg="" sx={{ pt: 5, bg: 'gray.0'}}>
          <Grid gap={2} columns={3}>
            <TextBlock title="Entities with UUID" body="Custom serializations for Documents with relationships"/>
            <TextBlock title="Automatable" body="Create custom pipelines for your Document flows"/>
            <TextBlock title="Extendable" body="Build to suite, extend with 100 over plugins"/>
            <TextBlock title="Approval System" body="Custom serializations for Documents with relationships"/>
            <TextBlock title="Custom Design" body="Bring your own style, keep in sync with your Design System"/>
            <TextBlock title="E-Signatures" body="Easy Approvals with our flexible signature collection"/>
          </Grid>

          <Box sx={{ pl: 5, py: 6}}>
            <Text sx={{ fontSize: 5, color: 'gray.9'}}>For Teams</Text>
            <Text sx={{ fontSize: 4, color: 'gray.6'}}>Built to suite your organizational needs</Text>
          </Box>
          
          <Grid gap={2} columns={3}>    
            <TextBlock title="Approval System" body="Verify documents across Organisations"/>
            <TextBlock title="Smart Templates" body="Easily replicate or bring your your own workflow!"/>
            <TextBlock title="Self-hosted" body="Open source software that’s ready to meet your needs!"/>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHome;
