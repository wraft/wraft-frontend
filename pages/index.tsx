import { FC } from 'react';
import Head from 'next/head';
import { Text, Box, Flex, Container } from 'theme-ui';
import Page from '../src/components/PageFrame';
import { useStoreState } from 'easy-peasy';
import UserNav from '../src/components/UserNav';
import UserHome from '../src/components/UserHome';
// import ApprovalList from '../src/components/ApprovalList';
import ContentTypeDashboard from '../src/components/ContentTypeDashboard';

/**
 * Content List Card
 * @returns
 */

// const ContentListCard: FC = () => {
//   return (
//     <Flex
//       sx={{
//         py: 3,
//         mt: 0,
//         borderBottom: 'solid 1px',
//         borderColor: 'gray.2',
//       }}>
//       <Box
//         sx={{ width: '30px', height: '30px', bg: 'blue.3', borderRadius: 99 }}
//       />
//       <Box sx={{ pl: 3 }}>
//         <Box sx={{ fontSize: 0, color: '#828282' }}>MNA/IN/240A</Box>
//         <Box>Offer Letter for Nizam Khadiri</Box>
//       </Box>
//       <Box sx={{ ml: 'auto' }}>
//         <Flex>
//           <Box sx={{ pr: 4, pt: 1 }}>
//             <Text sx={{ fontSize: 0 }}>1h</Text>
//           </Box>
//           <Box sx={{ pt: 2, mr: 4 }}>
//             <Avatar
//               width="20px"
//               src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
//             />
//             <Avatar
//               width="20px"
//               src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
//             />
//             <Avatar
//               width="20px"
//               src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
//             />
//           </Box>
//           <Button>Review</Button>
//         </Flex>
//       </Box>
//     </Flex>
//   );
// };

/**
 *
 * @returns
 */

// const ActivityCard = () => (
//   <Flex sx={{ border: 'solid 1px', borderColor: 'gray.3' }}>
//     <Box as="span">
//       <Avatar
//         width="32px"
//         sx={{ mr: 2 }}
//         src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
//       />
//     </Box>
//     <Text>
//       <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
//         Muneef Hameed
//       </Text>{' '}
//       <Text sx={{ fontSize: 0 }}>Commented on </Text>
//       <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
//         OFLLET-2010/A
//       </Text>
//     </Text>
//   </Flex>
// );

/**
 * DocType Cards
 * -------------
 *
 * @returns
 */

// const DocCard: FC = () => {
//   return (
//     <Box
//       sx={{
//         bg: 'gray.0',
//         width: '200px',
//         maxHeight: '200px',
//         border: 'solid 1px',
//         borderColor: 'gray.3',
//         borderRadius: 2,
//         mr: 3,
//       }}>
//       <Box sx={{ height: '45px', bg: 'blue.1' }}></Box>
//       <Box pl={3} pt={1} pb={1}>
//         <Text sx={{ fontSize: 1, pt: 1, color: 'gray.8' }}>Offer Letter</Text>
//       </Box>
//     </Box>
//   );
// };

const Index: FC = () => {
  const token = useStoreState((state) => state.auth.token);
  return (
    <>
      <Head>
        <title>Wraft - The Document Automation Platform</title>
        <meta
          name="description"
          content="Wraft is a document automation and pipelining tools for businesses"
        />
      </Head>
      {!token && (
        <Box>
          <UserNav />
          <UserHome />
        </Box>
      )}
      {token && (
        <Page>
          <Container variant="layout.pageFrame">
            <Box pb={3} pt={4} sx={{}}>
              {/* <Text variant="pagetitle" pb={0} mb={1}>
              Quick Start
            </Text> */}
              <Text sx={{ color: 'gray.7', fontSize: 1, pt: 0 }}>
                Get started with templates
              </Text>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Flex>
                <ContentTypeDashboard />
              </Flex>
            </Box>
            <Flex sx={{ width: '100%' }}>
              <Box sx={{ pb: 4, width: '55%' }}>
                <Box sx={{ py: 3, color: 'gray.5', fontSize: 1 }}>
                  <Text color="gray.7">Pending Actions</Text>
                </Box>
                <Box>{/* <ApprovalList /> */}</Box>
              </Box>
              <Box sx={{ pb: 4, width: '45%', pl: 4 }}>
                <Box sx={{ py: 3, color: 'gray.5', fontSize: 1 }}>
                  <Text color="gray.7">Activities</Text>
                </Box>
                {/* <ActivityFeed /> */}
              </Box>
            </Flex>
          </Container>
        </Page>
      )}
    </>
  );
};

export default Index;
