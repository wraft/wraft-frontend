import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Text, Box, Flex, Container, Button } from 'theme-ui';
import Page from '../components/PageFrame';
import { useStoreState } from 'easy-peasy';
import UserNav from '../components/UserNav';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
// import UserHome from '../components/UserHome';
import ContentTypeDashboard from '../components/ContentTypeDashboard';
import cookie from 'js-cookie';
const UserHome = dynamic(() => import('../components/UserHome'), {
  ssr: false,
});

const Index: FC = () => {
  const [isTeamInvite, setIsTeamInvite] = useState(false);
  const token = useStoreState((state) => state.auth.token);
  const [organisationName, setOrganisationName] = useState<string | null>(null);
  const inviteCookie = cookie.get('inviteCookie');

  useEffect(() => {
    if (inviteCookie) {
      const retrievedObject = JSON.parse(inviteCookie);
      setOrganisationName(retrievedObject.inviteOrganisation);
      setIsTeamInvite(true);
    }
  }, [inviteCookie]);

  const handleClick = async (event: React.FormEvent) => {
    event.preventDefault();
    // Parse the JSON string back into an object
    if (inviteCookie) {
      const retrievedObject = JSON.parse(inviteCookie);
      console.log(retrievedObject);
      try {
        // setLoading(true);
        const response = await fetch(`${API_HOST}/api/v1/join_organisation`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: retrievedObject.inviteToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:q', errorData);
          // You can also throw a custom error if needed
          throw new Error('team joining failed');
        } else {
          // Handle a successful response (if needed)
          const responseData = await response;
          console.log(responseData);
          setIsTeamInvite(false);
          // setResetPasswordSuccess(responseData);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Network error1:', error);
        // setResetPasswordSuccess(undefined);
      }
    }
  };
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
            <Box pb={3} pt={1} sx={{}}>
              {/* <Text variant="pagetitle" pb={0} mb={1}>
              Quick Start s
            </Text> */}
              <Text
                sx={{
                  color: 'gray.7',
                  fontSize: 2,
                  fontWeight: 'heading',
                  pt: 0,
                }}>
                Get started with templates
              </Text>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Flex>
                <ContentTypeDashboard />
              </Flex>
            </Box>
          </Container>
        </Page>
      )}
      {token && isTeamInvite && (
        <Flex
          sx={{
            flexDirection: 'column',
            py: '24px',
            px: '32px',
            width: '342px',
            height: '205px',
            border: '1px solid #E4E9EF',
            borderRadius: '4px',
            position: 'absolute',
            top: '38%',
            left: '38%',
            zIndex: '10',
            background: '#FFF',
            alignItems: 'center',
          }}>
          <Text
            sx={{
              marginTop: '23px',
              mb: '18px',
              textAlign: 'center',
              fontWeight: 'heading',
              color: 'dark_600',
            }}>
            {organisationName !== null
              ? `you have a team invite from ${organisationName}. Accept?`
              : ''}
          </Text>
          <Flex sx={{ gap: '12px' }}>
            <Button onClick={handleClick}>Confirm</Button>

            <Button
              onClick={() => setIsTeamInvite(false)}
              sx={{ bg: 'red', color: 'white' }}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};
export default Index;
