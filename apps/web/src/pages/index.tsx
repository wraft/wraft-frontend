import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import cookie from 'js-cookie';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';

import Dashboard from 'components/Dashboard';
import Page from 'components/PageFrame';
import UserNav from 'components/UserNav';
import Modal from 'common/Modal';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

const UserHome = dynamic(() => import('components/LandingBlock'), {
  ssr: false,
});

const Index: FC = () => {
  const [isTeamInvite, setIsTeamInvite] = useState(false);
  const [organisationName, setOrganisationName] = useState<string | null>(null);
  const inviteCookie = cookie.get('inviteCookie');

  const { accessToken, updateOrganisations } = useAuth();

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
      const formData = new FormData();
      formData.append('token', retrievedObject.inviteToken);

      const joinOrganisationRequest = postAPI(`join_organisation`, formData);

      toast.promise(joinOrganisationRequest, {
        loading: 'Loading',
        success: () => {
          setIsTeamInvite(false);
          updateOrganisations();
          cookie.remove('inviteCookie');
          return `Successfully joined`;
        },
        error: () => {
          setIsTeamInvite(false);
          cookie.remove('inviteCookie');
          return `Failed to join`;
        },
      });
    }
  };
  return (
    <>
      <Head>
        <title>Wraft | The Document Automation Platform</title>
        <meta
          name="description"
          content="Wraft is a document automation and pipelining tools for businesses"
        />
      </Head>
      {!accessToken && (
        <Box>
          <UserNav />
          <UserHome />
        </Box>
      )}
      {accessToken && (
        <Page>
          <Dashboard />
        </Page>
      )}
      <Modal
        isOpen={isTeamInvite}
        onClose={() => {
          setIsTeamInvite(false);
        }}>
        <Flex
          sx={{
            flexDirection: 'column',
            py: '24px',
            px: '32px',
            width: '342px',
            height: '205px',
            border: '1px solid #E4E9EF',
            borderRadius: '4px',
            background: '#FFF',
            alignItems: 'center',
          }}>
          <Text
            sx={{
              marginTop: '23px',
              mb: '18px',
              textAlign: 'center',
              fontWeight: 'heading',
              color: 'gray.600',
            }}>
            {organisationName !== null
              ? `you have a team invite from ${organisationName}. Accept?`
              : ''}
          </Text>
          <Flex sx={{ gap: '12px' }}>
            <Button onClick={handleClick}>Confirm</Button>

            <Button
              onClick={() => {
                setIsTeamInvite(false);
                cookie.remove('inviteCookie');
              }}
              sx={{ bg: 'red', color: 'white' }}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default Index;
