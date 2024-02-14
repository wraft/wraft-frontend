import React, { ReactElement } from 'react';
import Head from 'next/head';
import { Box, Flex, Text } from 'theme-ui';
import { Grid } from 'theme-ui';

import ButtonCustom from './ButtonCustom';
import Footer from './Footer';
import HR from './HR';
import {
  IconApproval,
  IconAutomatable,
  IconCustomDesign,
  IconEntities,
  IconIntegrations,
  IconSignature,
} from './IconFeatures';
import SvgTeams from './SvgTeams';
import SvgTypewriter from './SvgTypewriter';

export interface TextBlockProps {
  title: string;
  body: string;
  icon: ReactElement;
}

const TextBlock = ({ title, body, icon }: TextBlockProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '12px',
      }}>
      {icon}
      <Text
        as="h1"
        sx={{
          fontFamily: 'satoshi',
          fontSize: 3,
          fontWeight: 600,
          color: 'text',
        }}>
        {title}
      </Text>
      <Text as="p" sx={{ fontSize: 2, color: 'gray.400', textWrap: 'balance' }}>
        {body}
      </Text>
    </Box>
  );
};

const UserHome = () => {
  return (
    <Box bg="backgroundWhite">
      <Head>
        <link
          href="https://api.fontshare.com/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box
        variant="hero"
        sx={{ fontFamily: 'satoshi', px: [4, 2, 0], pt: '128px', pb: '200px' }}>
        <Box p={0} sx={{ maxWidth: '1040px', mx: 'auto', width: '100%' }}>
          <Flex
            sx={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            {/* 1st section */}
            <Flex sx={{ justifyContent: 'space-between', gap: 6 }}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <div>
                  <Text
                    as="h1"
                    variant="pagetitle"
                    sx={{
                      // fontSize: [5, 5, 7],
                      fontSize: '56px',
                      fontWeight: 700,
                      pb: 0,
                      m: 0,
                      color: 'text',
                      lineHeight: '1.20',
                    }}>
                    Documents for Humans
                  </Text>
                  <Text
                    as="h2"
                    sx={{
                      fontWeight: 400,
                      fontSize: [2, 2, 3],
                      my: 4,
                      color: 'text',
                      lineHeight: '1.25',
                    }}>
                    <span style={{ fontWeight: 700 }}>Automate</span>{' '}
                    Professional Documents
                  </Text>
                  <ButtonCustom text="Get Started" />
                </div>
              </Flex>
              <SvgTypewriter />
            </Flex>
            <HR />
            {/* 2nd section */}
            <Box sx={{ pt: 2 }}>
              <Grid
                gap={2}
                columns={[1, 2, 3]}
                sx={{ px: [4, 2, 0], gridRowGap: 6 }}>
                <TextBlock
                  icon={<IconEntities />}
                  title="Entities with UUID"
                  body="Custom serializations for Documents with relationships"
                />
                <TextBlock
                  icon={<IconAutomatable />}
                  title="Automatable"
                  body="Create custom pipelines for your Document flows"
                />
                <TextBlock
                  icon={<IconIntegrations />}
                  title="Integrations"
                  body="Integrate with with 100+ apps"
                />
                <TextBlock
                  icon={<IconApproval />}
                  title="Approval System"
                  body="Custom serializations for Documents with relationships"
                />
                <TextBlock
                  icon={<IconCustomDesign />}
                  title="Custom Design"
                  body="Bring your own style, keep in sync with your Design System"
                />
                <TextBlock
                  icon={<IconSignature />}
                  title="E-Signatures"
                  body="Easy Approvals with our flexible signature collection"
                />
              </Grid>
            </Box>
            <HR />
            {/* 3rd section */}
            <Flex sx={{ justifyContent: 'space-between', gap: 6 }}>
              <SvgTeams />
              <Flex
                sx={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <div>
                  <Text
                    as="h1"
                    variant="pagetitle"
                    sx={{
                      // fontSize: [5, 5, 7],
                      fontSize: '56px',
                      fontWeight: 700,
                      pb: 0,
                      m: 0,
                      color: 'text',
                      lineHeight: '1.20',
                    }}>
                    For teams
                  </Text>
                  <Text
                    as="h2"
                    sx={{
                      fontWeight: 400,
                      fontSize: [2, 2, 3],
                      my: 4,
                      color: 'text',
                      lineHeight: '1.25',
                    }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                  <ButtonCustom text="Join now" />
                </div>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default UserHome;
