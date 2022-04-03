import React from 'react';
import { Box, Text } from 'theme-ui';
import Container from './Container';
import { Button, Grid } from 'theme-ui';
import Head from 'next/head';

// import styled from 'styled-components';
// import Page from '../components/Page';

export interface TextBlockProps {
  title: string;
  body: string;
}

const TextBlock = ({ title, body }: TextBlockProps) => {
  return (
    <Box sx={{ p: 5 }}>
      <Text
        as="h1"
        sx={{
          fontFamily: 'Satoshi',
          fontSize: 4,
          fontWeight: 600,
          color: 'gray.9',
        }}>
        {title}
      </Text>
      <Text as="p" sx={{ fontSize: 3, color: 'gray.6' }}>
        {body}
      </Text>
    </Box>
  );
};

const UserHome = () => {
  return (
    <Box bg="gray.0">
      <Head>
        <link
          href="https://api.fontshare.com/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box variant="hero" pb={4} sx={{ pb: 6 }}>
        <Container width={70} bg="" sx={{ mb: 6 }}>
          <Box p={4} pl={0} pt={6} pb={4} sx={{ maxWidth: '50ch' }}>
            <Text
              as="h1"
              variant="pagetitle"
              sx={{
                fontSize: 7,
                fontWeight: 900,
                pb: 0,
                m: 0,
                mb: 3,
                color: 'gray.9',
                lineHeight: '1.20',
              }}>
              Documents for all
            </Text>
            <Text
              as="h2"
              sx={{ fontWeight: 300, fontSize: 5, mt: 0, color: 'gray.6', lineHeight: '1.25' }}>
              Open source platform for office/personal documents
            </Text>
          </Box>
          <Button
            sx={{  mt: 3, fontWeight: 600, mb: 5, fontSize: 3, borderRadius: '3rem', py: 3, px: 4 }}>
            Get Started
          </Button>
        </Container>
      </Box>
      <Box sx={{ pt: 5, bg: 'gray.0' }}>
        <Container width={70} bg="" sx={{ pt: 5, bg: 'gray.0' }}>
          <Grid gap={2} columns={3}>
            <TextBlock
              title="Entities with UUID"
              body="Custom serializations for Documents with relationships"
            />
            <TextBlock
              title="Automatable"
              body="Create custom pipelines for your Document flows"
            />
            <TextBlock
              title="Extendable"
              body="Build to suite, extend with 100 over plugins"
            />
            <TextBlock
              title="Approval System"
              body="Custom serializations for Documents with relationships"
            />
            <TextBlock
              title="Custom Design"
              body="Bring your own style, keep in sync with your Design System"
            />
            <TextBlock
              title="E-Signatures"
              body="Easy Approvals with our flexible signature collection"
            />
          </Grid>

          <Box sx={{ pl: 5, py: 6 }}>
            <Text sx={{ fontSize: 5, color: 'gray.9' }}>For Teams</Text>
            <Text sx={{ fontSize: 4, color: 'gray.6' }}>
              Built to suite your organizational needs
            </Text>
          </Box>

          <Grid gap={2} columns={3}>
            <TextBlock
              title="Approval System"
              body="Verify documents across Organisations"
            />
            <TextBlock
              title="Smart Templates"
              body="Easily replicate or bring your your own workflow!"
            />
            <TextBlock
              title="Self-hosted"
              body="Open source software that’s ready to meet your needs!"
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHome;
