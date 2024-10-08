import { Box, Flex, useColorMode } from 'theme-ui';

import { BrandLogo } from 'components/Icons';

import Container from './Container';
import ModeToggle from './ModeToggle';

const footerMenu = [
  { name: 'Overview', link: '' },
  { name: 'Features', link: '' },
  { name: 'Pricing', link: '' },
  { name: 'Careers', link: '' },
  { name: 'Help', link: '' },
  { name: 'Privacy', link: '' },
];

const LinkCompontent = ({ name }: any) => {
  return (
    <Box
      sx={{
        color: `text`,
        pb: 2,
        fontWeight: `500`,
        fontSize: `16px`,
      }}>
      {name}
    </Box>
  );
};

const Footer = () => {
  const [mode, setMode] = useColorMode();
  return (
    <Box
      sx={{ bg: 'backgroundWhite', color: '#94969C', pt: '64px', pb: '48px' }}>
      <Container width={70} bg="">
        <Flex
          sx={{
            flexDirection: 'row',
            gap: '32px',
            alignItems: 'center',
            mb: '64px',
            svg: {
              fill: 'gray.1200',
            },
          }}>
          <BrandLogo width="6rem" height="2rem" fill="gray.1200" />
          <Flex sx={{ gap: '32px', ml: 'auto' }}>
            {footerMenu.map((item, i) => (
              <LinkCompontent key={i} {...item} />
            ))}
          </Flex>
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', pt: '32px' }}>
          <Box>© 2024 Functionary Labs Pvt Ltd. All rights reserved.</Box>
          <Flex sx={{ gap: '32px' }}>
            <LinkCompontent name="Terms" />
            <LinkCompontent name="Privacy" />
            <LinkCompontent name="Cookies" />
          </Flex>
        </Flex>
        <Box
          sx={{ mt: 3 }}
          onClick={() => {
            const next = mode === 'dark' ? 'light' : 'dark';
            setMode(next);
          }}>
          <Box
            sx={{
              // mb: 0,
              ml: 'auto',
            }}>
            <ModeToggle sx={{ pt: 0, m: 0 }} variant="button" />
          </Box>
        </Box>
      </Container>
    </Box>

    // <Box sx={{ pt: 2, bg: '#022D11', color: '#fff' }}>
    //   <Container width={70} bg="">
    //     <Flex sx={{ py: 5, flex: 1, flexDirection: `row` }}>
    //       <Flex sx={{ flexDirection: `column` }}>
    //         <Box sx={{ maxWidth: `10%`, flex: 1 }}>
    //           <BrandLogo width="6rem" height="2rem" />
    //         </Box>
    //         <Text as="p" sx={{ color: `#767676` }}>
    //           © wraft 2022
    //         </Text>
    //       </Flex>
    //       <Flex sx={{ ml: 6, gap: `6ch` }}>
    //         <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
    //           <Box as="ul" sx={{ listStyle: `none` }}>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `500` }}>
    //               About
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Features
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Team
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Pricing
    //             </Box>
    //           </Box>
    //         </Box>
    //         <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
    //           <Box as="ul" sx={{ listStyle: `none` }}>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `500` }}>
    //               Comparison
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Team
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Features
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Pricing
    //             </Box>
    //           </Box>
    //         </Box>

    //         <Box sx={{ maxWidth: `12ch`, flex: 1 }}>
    //           <Box as="ul" sx={{ listStyle: `none` }}>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `500` }}>
    //               Industries
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Finance
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               HR
    //             </Box>
    //             <Box as="li" sx={{ color: `text`, pb: 2, fontWeight: `700` }}>
    //               Law
    //             </Box>
    //           </Box>
    //         </Box>
    //       </Flex>
    //       <Box sx={{ ml: `auto` }}>
    //         <Flex sx={{ flexDirection: `column`, alignItems: `flex-end` }}>
    //           <Flex sx={{ gap: `20px`, pb: 3, pt: 1 }}>
    //             <a
    //               href="https://twitter.com/functionarylabs"
    //               target="_blank"
    //               rel="noreferrer">
    //               {` `}
    //               <svg
    //                 width="22"
    //                 height="18"
    //                 viewBox="0 0 28 22"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M24.6033 5.55834C24.6195 5.79343 24.6195 6.02852 24.6195 6.26577C24.6195 13.495 19.1161 21.8324 9.05287 21.8324V21.8281C6.08016 21.8324 3.16919 20.9809 0.666656 19.3754C1.09891 19.4274 1.53334 19.4534 1.96884 19.4545C4.43238 19.4566 6.8255 18.63 8.76361 17.1079C6.42249 17.0635 4.36955 15.5371 3.65237 13.3086C4.47246 13.4668 5.31748 13.4343 6.12241 13.2144C3.57003 12.6987 1.73376 10.4562 1.73376 7.85179C1.73376 7.82796 1.73376 7.80521 1.73376 7.78246C2.49427 8.20605 3.34578 8.44114 4.21679 8.46714C1.81284 6.86053 1.07183 3.66248 2.52352 1.16211C5.30123 4.58008 9.39954 6.65794 13.799 6.87786C13.3581 4.97767 13.9604 2.98647 15.3818 1.6507C17.5853 -0.420662 21.051 -0.314494 23.1223 1.88796C24.3476 1.64637 25.5219 1.19678 26.5966 0.559769C26.1882 1.8262 25.3334 2.90197 24.1916 3.58556C25.276 3.45773 26.3355 3.16739 27.3333 2.7243C26.5988 3.82498 25.6736 4.78375 24.6033 5.55834Z" />
    //               </svg>
    //             </a>
    //             <a
    //               href="https://www.linkedin.com/company/functionary-labs/"
    //               target="_blank"
    //               rel="noreferrer">
    //               {` `}
    //               <svg
    //                 width="22"
    //                 height="18"
    //                 viewBox="0 0 25 24"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M24.0017 1.7647V22.2353C24.0017 22.7033 23.8158 23.1522 23.4848 23.4831C23.1539 23.8141 22.705 24 22.237 24H1.76641C1.29838 24 0.849525 23.8141 0.518579 23.4831C0.187633 23.1522 0.00170898 22.7033 0.00170898 22.2353L0.00170898 1.7647C0.00170898 1.29668 0.187633 0.847816 0.518579 0.51687C0.849525 0.185924 1.29838 0 1.76641 0L22.237 0C22.705 0 23.1539 0.185924 23.4848 0.51687C23.8158 0.847816 24.0017 1.29668 24.0017 1.7647ZM7.06053 9.17647H3.53112V20.4706H7.06053V9.17647ZM7.37817 5.29411C7.38003 5.02714 7.32929 4.76242 7.22884 4.51506C7.12839 4.2677 6.9802 4.04255 6.79274 3.85246C6.60527 3.66237 6.3822 3.51107 6.13626 3.40719C5.89032 3.30332 5.62632 3.2489 5.35935 3.24706H5.29582C4.75291 3.24706 4.23223 3.46273 3.84834 3.84663C3.46444 4.23052 3.24877 4.7512 3.24877 5.29411C3.24877 5.83703 3.46444 6.3577 3.84834 6.7416C4.23223 7.1255 4.75291 7.34117 5.29582 7.34117C5.56281 7.34774 5.82848 7.30164 6.07765 7.20549C6.32681 7.10935 6.55459 6.96506 6.74797 6.78086C6.94135 6.59665 7.09654 6.37615 7.20468 6.13195C7.31281 5.88775 7.37176 5.62464 7.37817 5.35764V5.29411ZM20.4723 13.6094C20.4723 10.2141 18.3123 8.89411 16.1664 8.89411C15.4638 8.85893 14.7642 9.00858 14.1375 9.32813C13.5108 9.64768 12.9788 10.126 12.5946 10.7153H12.4958V9.17647H9.17817V20.4706H12.7076V14.4635C12.6566 13.8483 12.8504 13.2378 13.2469 12.7646C13.6434 12.2915 14.2106 11.9939 14.8252 11.9365H14.9593C16.0817 11.9365 16.9146 12.6423 16.9146 14.4212V20.4706H20.444L20.4723 13.6094Z" />
    //               </svg>
    //             </a>
    //             <a
    //               href="https://www.linkedin.com/company/functionary-labs/"
    //               target="_blank"
    //               rel="noreferrer">
    //               {` `}
    //               <svg
    //                 width="22"
    //                 height="18"
    //                 viewBox="0 0 25 24"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M23.4257 11.5682C23.4257 5.317 18.382 0.25 12.159 0.25C5.93605 0.25 0.892334 5.317 0.892334 11.5682C0.892334 17.2188 5.01143 21.901 10.3984 22.75V14.8405H7.53817V11.5675H10.3984V9.0745C10.3984 6.238 12.0801 4.6705 14.6542 4.6705C15.886 4.6705 17.1764 4.89175 17.1764 4.89175V7.67725H15.7546C14.3553 7.67725 13.9196 8.55025 13.9196 9.44575V11.5682H17.0442L16.5447 14.8397H13.9196V22.75C19.3066 21.901 23.4257 17.2188 23.4257 11.5682Z" />
    //               </svg>
    //             </a>
    //             <a
    //               href="https://github.com/functionaryco"
    //               target="_blank"
    //               rel="noreferrer">
    //               {` `}
    //               <svg
    //                 width="22"
    //                 height="18"
    //                 viewBox="0 0 28 28"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path
    //                   fillRule="evenodd"
    //                   clipRule="evenodd"
    //                   d="M14.0001 0.996094C6.63341 0.996094 0.666748 6.96276 0.666748 14.3294C0.666748 20.2294 4.48341 25.2127 9.78341 26.9794C10.4501 27.0961 10.7001 26.6961 10.7001 26.3461C10.7001 26.0294 10.6834 24.9794 10.6834 23.8627C7.33341 24.4794 6.46674 23.0461 6.20008 22.2961C6.05008 21.9127 5.40008 20.7294 4.83341 20.4127C4.36675 20.1627 3.70008 19.5461 4.81675 19.5294C5.86674 19.5127 6.61674 20.4961 6.86674 20.8961C8.06674 22.9127 9.98341 22.3461 10.7501 21.9961C10.8667 21.1294 11.2167 20.5461 11.6001 20.2127C8.63341 19.8794 5.53341 18.7294 5.53341 13.6294C5.53341 12.1794 6.05008 10.9794 6.90008 10.0461C6.76674 9.71276 6.30008 8.34609 7.03341 6.51276C7.03341 6.51276 8.15008 6.16276 10.7001 7.87942C11.7667 7.57942 12.9001 7.42942 14.0334 7.42942C15.1667 7.42942 16.3001 7.57942 17.3667 7.87942C19.9167 6.14609 21.0334 6.51276 21.0334 6.51276C21.7667 8.34609 21.3001 9.71276 21.1667 10.0461C22.0167 10.9794 22.5334 12.1628 22.5334 13.6294C22.5334 18.7461 19.4167 19.8794 16.4501 20.2127C16.9334 20.6294 17.3501 21.4294 17.3501 22.6794C17.3501 24.4627 17.3334 25.8961 17.3334 26.3461C17.3334 26.6961 17.5834 27.1127 18.2501 26.9794C20.897 26.0858 23.197 24.3847 24.8265 22.1155C26.4559 19.8462 27.3327 17.1231 27.3334 14.3294C27.3334 6.96276 21.3667 0.996094 14.0001 0.996094Z"
    //                 />
    //               </svg>
    //             </a>
    //           </Flex>
    //           <Flex sx={{ gap: `20px` }}>
    //             <Text as="p" sx={{ color: `text`, fontWeight: `500` }}>
    //               Privacy
    //             </Text>
    //             <Text as="p" sx={{ color: `text`, fontWeight: `500` }}>
    //               Contact
    //             </Text>
    //           </Flex>
    //           <ModeToggle variant="button" />
    //         </Flex>
    //       </Box>
    //     </Flex>
    //   </Container>
    // </Box>
  );
};

export default Footer;
