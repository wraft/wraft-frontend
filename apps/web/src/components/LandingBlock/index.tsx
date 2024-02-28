import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Box, Flex, Text, Container, Heading, Grid } from 'theme-ui';
import styled from '@emotion/styled';
import { Link } from '@wraft/ui';

import Footer from 'components/Footer';

import data from './home.json';

const LandingBlockWrapper = styled(Box)`
  --lp-text-color: 16px;
  font-family: 'Mona Sans', sans-serif;
`;
const H1 = styled(Heading)`
  font-size: 66px;
  font-weight: 600;
  line-height: 80px;
  margin: 0;
  white-space: pre-line;
`;
const H2 = styled.h2`
  font-size: 48px;
  font-weight: 600;
  line-height: 60px;
  margin: 0;
`;
const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 400;
  line-heigh: 30px;
  margin: 0;
  color: #475467;
`;

const MainSection = styled(Flex)`
  background: #f2f7f4;
  height: 92vh;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const LandingBlock = () => {
  return (
    <LandingBlockWrapper bg="backgroundWhite">
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/mona-sans?styles=144345,144339,144351,144321"
          rel="stylesheet"
        />
        {/* <link
          href="https://api.fontshare.com/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        /> */}
      </Head>

      <MainSection>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <Box
            as="span"
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              backgroundImage: 'url(background-pattern.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'auto',
            }}
          />
          <Box
            sx={{
              bottom: 0,
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
            }}>
            <Image
              alt="Home page visual representation"
              src="/home01.png"
              width={900}
              height={400}
              style={{ width: '60%', height: 'auto' }}
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', position: 'absolute' }}>
          <H1 as="h1" pt="124px">
            {data.main_section?.title}
          </H1>
          <Subtitle>{data.main_section?.sub_title}</Subtitle>
          <Flex sx={{ gap: 2, justifyContent: 'center', mt: 3 }}>
            <Link type="button">Sign up</Link>
            <Link type="button" variant="secondary">
              Demo
            </Link>
          </Flex>
        </Box>
      </MainSection>

      <Box as="section">
        <Box sx={{ textAlign: 'center', mb: '90px', mt: '45px' }}>
          <H2>Open Document Lifecycle</H2>
          <Subtitle>
            Future proof way to sustain your companies document, end-to-end.
          </Subtitle>
        </Box>
        <Container sx={{ maxWidth: '1140px', mx: 'auto', mb: '120px' }}>
          <Grid
            sx={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '36px',
              '&> div': {
                gridColumn: 'span 1',
                flexDirection: 'column-reverse',
                p: '28px',
                '.future_block_title': {
                  pt: '48px',
                },
              },
              '&> :first-child, &> :last-child': {
                gridColumn: 'span 2',
                flexDirection: 'row',
                p: '48px',
                '.future_block_left': {
                  width: '50%',
                },
              },
            }}>
            {data?.future_proof_sections?.section.map((item, i) => (
              <Flex
                key={i}
                className={item.class}
                sx={{
                  border: '1px solid',
                  borderColor: 'gray.200',
                  borderRadius: '12px',
                }}>
                <Box className="future_block_left">
                  <Box
                    className="future_block_title"
                    sx={{ fontSize: '16px', color: '#004A0F' }}>
                    {item.subtitle}
                  </Box>
                  <Text as="h3" sx={{ fontSize: '29px' }}>
                    {item.title}
                  </Text>

                  <Box sx={{ fontSize: '18px' }}>{item.des}</Box>
                </Box>

                <Box className="future_block_right" sx={{ width: '50%' }}>
                  <Image
                    alt="Home page visual representation"
                    src="/home02.png"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Flex>
            ))}
          </Grid>

          {/* <Flex sx={{ gap: 4, mb: '36px' }}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'gray.200',
                borderRadius: '12px',
                p: '48px',
                gap: 4,
                width: '50%',
              }}>
              <Box>
                <Image
                  alt="Home page visual representation"
                  src="/home02.png"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
              <Box>
                <Box sx={{ fontSize: '16px' }}>Easy and Effective</Box>
                <Text as="h3" sx={{ fontSize: '29px' }}>
                  Document generation
                </Text>

                <Box sx={{ fontSize: '18px' }}>
                  With Wrafts intuitive interface, you can stay organized and on
                  top of your workload with ease, and make document generation
                  and management a breeze.
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'gray.200',
                borderRadius: '12px',
                p: '48px',
                gap: 4,
                width: '50%',
              }}>
              <Box>
                <Image
                  alt="Home page visual representation"
                  src="/home02.png"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
              <Box>
                <Box sx={{ fontSize: '16px' }}>Easy and Effective</Box>
                <Text as="h3" sx={{ fontSize: '29px' }}>
                  Document generation
                </Text>

                <Box sx={{ fontSize: '18px' }}>
                  With Wrafts intuitive interface, you can stay organized and on
                  top of your workload with ease, and make document generation
                  and management a breeze.
                </Box>
              </Box>
            </Box>
          </Flex> */}

          {/* <Flex
            sx={{
              border: '1px solid',
              borderColor: 'gray.200',
              borderRadius: '12px',
              p: '48px',
              gap: 4,
            }}>
            <Box sx={{ width: '50%' }}>
              <Image
                alt="Home page visual representation"
                src="/home02.png"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
            <Box sx={{ width: '50%' }}>
              <Box sx={{ fontSize: '16px' }}>Easy and Effective</Box>
              <Text as="h3" sx={{ fontSize: '29px' }}>
                Document generation
              </Text>

              <Box sx={{ fontSize: '18px' }}>
                With Wrafts intuitive interface, you can stay organized and on
                top of your workload with ease, and make document generation and
                management a breeze.
              </Box>
            </Box>
          </Flex> */}
        </Container>
      </Box>

      <Box as="section">
        <Box sx={{ textAlign: 'center', mb: '90px' }}>
          <H2>{data?.case_studies_sections?.title}</H2>
          <Subtitle>{data?.case_studies_sections?.sub_title}</Subtitle>
        </Box>
        <Box sx={{ mx: 'auto', mb: '120px' }}>
          {/* <Container sx={{ maxWidth: '1140px', mx: 'auto', mb: '120px' }}> */}
          <Box
            className="content"
            sx={{
              display: 'grid',
              gridTemplateColumns: [
                '[full-start] 1fr [content-start] 1140px [content-end] 1fr [full-end]',
              ],
            }}>
            <Grid
              sx={{
                gridColumn: 'full',
                overflowX: 'scroll',
                gridTemplateColumns: 'inherit',
                'overscroll-behavior-x': 'contain',
                'scroll-snap-type': 'x mandatory',
                'scrollbar-width': 'none',
              }}>
              <Flex
                sx={{
                  gap: 4,
                  gridColumn: 'content',
                }}>
                {data?.case_studies_sections?.case_studies.map((item, i) => (
                  <Flex
                    key={i}
                    sx={{
                      width: '384px',
                      height: '504px',
                      bg: '#002705',
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      flexShrink: 0,
                      flexDirection: 'column',
                      justifyContent: 'end',
                      color: '#fff',
                    }}>
                    <Box
                      sx={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        px: '24px',
                        py: '32px',
                        height: '250px',
                      }}>
                      <Box as="h5" sx={{ fontSize: '24px', mb: '16px' }}>
                        {item.title}
                      </Box>
                      <Box>{item.des}</Box>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box sx={{ textAlign: 'center', mb: '90px' }}>
          <Box>{data?.more_about_section?.tag}</Box>
          <H2>{data?.more_about_section?.title}</H2>
          <Subtitle>{data?.more_about_section?.sub_title}</Subtitle>
        </Box>
        <Container sx={{ maxWidth: '1140px', mx: 'auto', mb: '120px' }}>
          <Flex
            sx={{
              gap: 4,
              overflowX: 'scroll',
            }}>
            {data?.more_about_section?.sections.map((item, i) => (
              <Flex
                key={i}
                sx={{
                  height: '338px',
                  bg: '#F9FAFB',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  color: '#101828',
                  width: 'calc(25% - 24px)',
                  maxWidth: '384px',
                }}>
                <Box sx={{ height: '120px' }} />
                <Box as="h5" sx={{ fontSize: '20px', mb: '8px' }}>
                  {item.title}
                </Box>
                <Box sx={{ fontSize: '16px' }}>{item.des}</Box>
              </Flex>
            ))}
          </Flex>
        </Container>
      </Box>
      <Box as="section" sx={{ maxWidth: '1140px', mx: 'auto', mb: '90px' }}>
        <Box sx={{ background: '#F9FAFB', p: '64px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <H2>{data?.hosting_section?.title}</H2>
            <Subtitle>{data?.hosting_section?.sub_title}</Subtitle>
          </Box>
          <Flex sx={{ gap: 2, justifyContent: 'center', mt: 3 }}>
            <Link type="button">Sign up</Link>
            <Link type="button" variant="secondary">
              Demo
            </Link>
          </Flex>
        </Box>
      </Box>
      <Footer />
    </LandingBlockWrapper>
  );
};

export default LandingBlock;
