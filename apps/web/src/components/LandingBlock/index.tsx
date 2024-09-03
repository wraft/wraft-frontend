import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Box, Flex, Text, Container, Grid } from 'theme-ui';
import styled from '@emotion/styled';
import { Modal } from '@wraft/ui';

import Footer from 'components/Footer';
import NextLinkText from 'components/NavLink';

import data from './home.json';

const LandingBlockWrapper = styled(Box)`
  --lp-text-color: 16px;
  font-family: 'Mona Sans', sans-serif;
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
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const LandingBlock = () => {
  const [isOpendemoModal, setOpendemoModal] = useState<boolean>(false);

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
              opacity: 0.25,
            }}
          />
          {/* <Box
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
          </Box> */}
        </Box>
        <Box sx={{ textAlign: 'center', position: 'relative' }}>
          <Box sx={{ maxWidth: '80ch', mx: 'auto', mb: 2 }}>
            <Text
              as="h1"
              pt="124px"
              sx={{ fontSize: '5xl', lineHeight: 1, mb: 3 }}>
              {data.main_section?.title}
            </Text>
            <Text
              as="h2"
              sx={{ fontSize: '3xl', fontWeight: 400, color: 'gray.1000' }}>
              {data.main_section?.sub_title}
            </Text>
          </Box>
          <Flex sx={{ gap: 2, justifyContent: 'center', mt: 3 }}>
            <NextLinkText variant={'primaryLarge'} href="/signup">
              Get Started
            </NextLinkText>
            <Box
              sx={{
                backgroundColor: 'gray.100',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'green.1200',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'solid 1px',
                borderColor: 'green.900',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'green.200',
                  borderColor: 'green.a500',
                  color: 'green.700',
                },
              }}
              onClick={() => setOpendemoModal(true)}>
              Watch Demo
            </Box>
          </Flex>
          <Box mt="92px">
            <Image
              alt="Home page visual representation"
              src="/home01.png"
              width={900}
              height={400}
              style={{ width: '60%', height: 'auto' }}
            />
          </Box>
        </Box>
      </MainSection>

      <Box as="section" id="features">
        <Container sx={{ maxWidth: '1140px', mx: 'auto', mb: '120px' }}>
          <Box sx={{ textAlign: 'left', mb: '90px', mt: 6 }}>
            <Text
              as="h1"
              sx={{ fontSize: '3xl', fontWeight: 600, color: 'gray.1200' }}>
              Open Document Lifecycle
            </Text>
            <Text sx={{ fontSize: '2xl', fontWeight: 400, color: 'gray.1000' }}>
              Future proof way to sustain your companies document, end-to-end.
            </Text>
          </Box>
        </Container>
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
                  borderColor: 'gray.a400',
                  borderRadius: '12px',
                }}>
                <Box className="future_block_left">
                  <Box
                    className="future_block_title"
                    sx={{ fontSize: 'base', color: 'gray.900' }}>
                    {item.subtitle}
                  </Box>
                  <Text as="h3" sx={{ fontSize: '2xl', mb: 2 }}>
                    {item.title}
                  </Text>

                  <Box sx={{ fontSize: 'xl', mr: 4 }}>{item.des}</Box>
                </Box>

                <Box className="future_block_right" sx={{ width: '50%' }}>
                  <Image
                    alt="Home page visual representation"
                    src={item.image ? item.image : '/home02.png'}
                    width={600}
                    height={400}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '4px',
                      border: '1px solid rgb(214 218 225)',
                    }}
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
                      bg: 'green.300',
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      flexShrink: 0,
                      flexDirection: 'column',
                      justifyContent: 'end',
                      color: 'text',
                    }}>
                    <Box
                      sx={{
                        // background: 'rgba(255, 255, 255, 0.3)',
                        px: 3,
                        py: 3,
                        height: '250px',
                        bg: 'green.a300',
                        borderRadius: '4px',
                        width: '100%',
                      }}></Box>
                    <Box
                      sx={{
                        // background: 'rgba(255, 255, 255, 0.3)',
                        px: 3,
                        py: 3,
                        height: '250px',
                      }}>
                      <Box as="h5" sx={{ fontSize: 'xl', mb: '16px' }}>
                        {item.title}
                      </Box>
                      <Box sx={{ fontSize: 'base', mb: '16px' }}>
                        {item.des}
                      </Box>
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
        <Box
          sx={{ background: 'green.300', p: '64px', borderRadius: '0.75rem' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Text as="h2" sx={{ fontSize: '1.25rem' }}>
              {data?.hosting_section?.title}
            </Text>
            <Text as="h3" sx={{ fontWeight: 'normal', fontSize: '1.25rem' }}>
              {data?.hosting_section?.sub_title}
            </Text>
          </Box>
          <Flex sx={{ gap: 2, justifyContent: 'center', mt: 3 }}>
            <NextLinkText variant={'primaryLarge'} href="/signup">
              Sign up
            </NextLinkText>
            <NextLinkText variant={'secondaryLarge'} href="/login">
              Demo
            </NextLinkText>
          </Flex>
        </Box>
      </Box>
      <Footer />
      <Modal
        open={isOpendemoModal}
        ariaLabel="delete modal"
        onClose={() => setOpendemoModal(false)}>
        <>
          {isOpendemoModal && (
            <Box sx={{ width: '100ch' }}>
              <Flex
                sx={{
                  position: 'relative',
                  width: '`100%',
                  height: '72vh',
                }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  src="https://www.youtube.com/embed/I71DmG_t3rA?si=fYvnDjHdWdRhilx5?rel=0&modestbranding=1&autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"></iframe>
              </Flex>
            </Box>
          )}
        </>
      </Modal>
    </LandingBlockWrapper>
  );
};

export default LandingBlock;
