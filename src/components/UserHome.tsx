import React from 'react';
import { Box, Flex, Image, Text } from 'theme-ui';
import Container from './Container';
import { Button, Grid } from 'theme-ui';
import Head from 'next/head';
import ModeToggle from './ModeToggle';
import { BrandLogo } from './Icons';

// import styled from 'styled-components';
// import Page from '../components/Page';

export interface TextBlockProps {
  title: string;
  body: string;
}

const TextBlock = ({ title, body }: TextBlockProps) => {
  return (
    <Box sx={{ py: [2, 2, 5], mr: [2, 2, 4] }}>
      <Image
        width="48px"
        height="48px"
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8cGF0aCBkPSJtNDU5LjM1IDYwOS40OGMtNzUuMzAxIDAtMTM2Ljg2LTYxLjU2Ni0xMzYuODYtMTM2Ljg2IDAtNzUuMzAxIDYxLjU2Ni0xMzYuODYgMTM2Ljg2LTEzNi44NiA3NS4zMDEgMCAxMzYuODYgNjEuNTY2IDEzNi44NiAxMzYuODZzLTYxLjU2MiAxMzYuODYtMTM2Ljg2IDEzNi44NnptMC0yNTYuNjhjLTY2LjMwMSAwLTExOS44MiA1My45ODgtMTE5LjgyIDExOS44MiAwIDY2LjMwMSA1My45ODggMTE5LjgyIDExOS44MiAxMTkuODIgNjYuMzAxIDAgMTE5LjgyLTUzLjk4OCAxMTkuODItMTE5LjgyIDAtNjYuMzAxLTUzLjk4OC0xMTkuODItMTE5LjgyLTExOS44MnoiLz4KICA8cGF0aCBkPSJtNDI5Ljk5IDUyMS4zOWMtMi4zNjcyIDAuNDcyNjYtNC43MzQ0LTAuNDcyNjYtNi42Mjg5LTIuMzY3MmwtNDEuNjc2LTQzLjA5OGMtMi44Mzk4LTIuODM5OC0yLjgzOTgtOC4wNTA4IDAtMTAuODkxczguMDUwOC0yLjgzOTggMTAuODkxIDBsMzYuNDY1IDM3Ljg4NyA5NS4xOTEtODMuODI0YzMuMzE2NC0yLjgzOTggOC4wNTA4LTIuMzY3MiAxMC44OTEgMC40NzI2NiAyLjgzOTggMy4zMTY0IDIuMzY3MiA4LjA1MDgtMC40NzI2NiAxMC44OTFsLTEwMC40IDg5LjAzNWMtMS40MTggMS40MjE5LTIuODM5OCAxLjg5NDUtNC4yNjE3IDEuODk0NXoiLz4KICA8cGF0aCBkPSJtMzM5LjA2IDYwOS40OGgtMTY5LjU0Yy00LjczNDQgMC04Ljk5NjEtNC4yNjE3LTguOTk2MS04Ljk5NjF2LTQ0OC45NmMwLTQuNzM0NCA0LjI2MTctOC45OTYxIDguOTk2MS04Ljk5NjFoMjg0LjYyYzIuMzY3MiAwIDQuNzM0NCAwLjk0NTMxIDYuMTU2MiAyLjM2NzJsODIuNDAyIDgwLjUwOGMxLjg5NDUgMS44OTQ1IDIuODM5OCAzLjc4OTEgMi44Mzk4IDYuNjI4OXY4Mi40MDJjMCA0LjczNDQtNC4yNjE3IDguOTk2MS04Ljk5NjEgOC45OTYxLTQuNzM0NCAwLjAwMzkwNi04Ljk5NjEtNC4yNTc4LTguOTk2MS05LjQ2ODh2LTc4LjE0MWwtNzcuMTkxLTc1LjI5N2gtMjcxLjg0djQzMC45NmgxNjAuNTRjNC43MzQ0IDAgOC45OTYxIDQuMjYxNyA4Ljk5NjEgOC45OTYxIDAgNC43MzgzLTMuNzg1MiA5LTguOTk2MSA5eiIvPgogIDxwYXRoIGQ9Im0yMzIuMDMgMjk2LjQ0aDE4OS45MWM1LjY4MzYgMCAxMC40MTgtNC43MzQ0IDEwLjQxOC0xMC40MTggMC01LjY4MzYtNC43MzQ0LTEwLjQxOC0xMC40MTgtMTAuNDE4bC0xODkuOTEtMC4wMDM5MDdjLTUuNjgzNiAwLTEwLjQxOCA0LjczNDQtMTAuNDE4IDEwLjQxOCAwIDUuNjgzNiA0LjczODMgMTAuNDIyIDEwLjQxOCAxMC40MjJ6Ii8+CiAgPHBhdGggZD0ibTIzMi45OCAyMzkuMTRoMTg5LjkxYzUuNjgzNiAwIDEwLjQxOC00LjczNDQgMTAuNDE4LTEwLjQxOHMtNC43MzQ0LTEwLjQxOC0xMC40MTgtMTAuNDE4aC0xODkuOTFjLTUuNjgzNiAwLTEwLjQxOCA0LjczNDQtMTAuNDE4IDEwLjQxOHM0LjczNDQgMTAuNDE4IDEwLjQxOCAxMC40MTh6Ii8+CiAgPHBhdGggZD0ibTIzMi45OCAzNTUuMTZoMTExLjI5YzUuNjgzNiAwIDEwLjQxOC00LjczNDQgMTAuNDE4LTEwLjQxOHMtNC43MzQ0LTEwLjQxOC0xMC40MTgtMTAuNDE4aC0xMTEuMjljLTUuNjgzNiAwLTEwLjQxOCA0LjczNDQtMTAuNDE4IDEwLjQxOHM0LjczNDQgMTAuNDE4IDEwLjQxOCAxMC40MTh6Ii8+CiAgPHBhdGggZD0ibTMwMS42NSA0MTUuNzhoLTY5LjE0MWMtNS42ODM2IDAtMTAuNDE4LTQuNzM0NC0xMC40MTgtMTAuNDE4IDAtNS42ODM2IDQuNzM0NC0xMC40MTggMTAuNDE4LTEwLjQxOGg2OS42MTdjNS42ODM2IDAgMTAuNDE4IDQuNzM0NCAxMC40MTggMTAuNDE4IDAgNS42ODM2LTUuMjEwOSAxMC40MTgtMTAuODk1IDEwLjQxOHoiLz4KIDwvZz4KPC9zdmc+Cg=="
      />
      <Text
        as="h1"
        sx={{
          fontFamily: 'Satoshi',
          fontSize: 3,
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
      <Box variant="hero" pb={4} sx={{ px: [4, 2, 0] }}>
        <Container width={70} bg="">
          <Box p={4} pl={0} pt={6} pb={4} sx={{ maxWidth: '50ch' }}>
            <Text
              as="h1"
              variant="pagetitle"
              sx={{
                fontSize: [5, 5, 7],
                fontWeight: 900,
                pb: 0,
                m: 0,
                mb: 3,
                color: 'gray.9',
                lineHeight: '1.20',
              }}>
              Documents for Humans
            </Text>
            <Text
              as="h2"
              sx={{
                fontWeight: 300,
                fontSize: [4, 4, 5],
                mt: 0,
                color: 'gray.6',
                lineHeight: '1.25',
              }}>
              Automate Professional Documents
            </Text>
          </Box>
          <Button
            sx={{
              mt: [1, 2, 3],
              fontWeight: 600,
              mb: 5,
              fontSize: [2, 2, 3],
              borderRadius: '3rem',
              py: [2, 1, 3],
              px: [4, 1, 4],
            }}>
            Get Started
          </Button>
        </Container>
      </Box>
      <Box sx={{ pt: 2, bg: 'gray.0' }}>
        <Container width={70} bg="">
          <Box sx={{ pl: 0, py: 0, pb: 4,}}>
            <Text as="h2" sx={{ fontSize: 5, color: 'gray.9' }}>
              For Teams
            </Text>
            <Text
              as="h3"
              sx={{ fontWeight: 100, fontSize: 4, color: 'gray.6' }}>
              Built to suite your organizational needs
            </Text>
          </Box>
          <Grid gap={2} columns={[1, 2, 3]} sx={{ px: [4, 2, 0] }}>
            <TextBlock
              title="Entities with UUID"
              body="Custom serializations for Documents with relationships"
            />
            <TextBlock
              title="Automatable"
              body="Create custom pipelines for your Document flows"
            />
            <TextBlock
              title="Integrations"
              body="Integrate with with 100+ apps"
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
        </Container>
      </Box>
      <Box>
        <Container width={70} bg="">
          <Box sx={{ py: 5, px: [4] }}>
            <Box sx={{ pl: 0, py: 0, pb: 4 }}>
              <Text as="h2" sx={{ fontSize: 5, color: 'gray.9' }}>
                For Teams
              </Text>
              <Text
                as="h3"
                sx={{ fontWeight: 100, fontSize: 4, color: 'gray.6' }}>
                Built to suite your organizational needs
              </Text>
            </Box>

            <Grid gap={[1, 1, 2]} columns={[1, 2, 3]}>
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
          </Box>
        </Container>
      </Box>
      <Box sx={{ pt: 2, bg: 'gray.1' }}>
        <Container width={70} bg="">
          <Flex sx={{ py: 5, flex: 1, flexDirection: `row` }}>
            <Box sx={{ maxWidth: `10%`, flex: 1 }}>
              <BrandLogo width="6rem" height="2rem" />
            </Box>
            <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
              <Box as="ul" sx={{ listStyle: `none` }}>
                <Box as="li" sx={{ color: `gray.6`, pb: 1 }}>
                  About
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Features
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Team
                </Box>
                {/* <Box as="li" sx={{ color: `gray.9`, pb: 1}}>Features</Box> */}
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Pricing
                </Box>
              </Box>
            </Box>
            <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
              <Box as="ul" sx={{ listStyle: `none` }}>
                <Box as="li" sx={{ color: `gray.6`, pb: 1 }}>
                  Comparison
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Team
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Features
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Pricing
                </Box>
              </Box>
            </Box>

            <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
              <Box as="ul" sx={{ listStyle: `none` }}>
                <Box as="li" sx={{ color: `gray.6`, pb: 1 }}>
                  Industries
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Finance
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  HR
                </Box>
                <Box as="li" sx={{ color: `gray.9`, pb: 1 }}>
                  Law
                </Box>
              </Box>
            </Box>
            <Box sx={{ ml: `auto` }}>
              <ModeToggle variant="button" />
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHome;
