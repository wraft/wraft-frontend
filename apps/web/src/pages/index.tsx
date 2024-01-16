import { FC, useEffect, useState } from 'react';

import { useStoreState } from 'easy-peasy';
import cookie from 'js-cookie';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';

import Dashboard from '../components/Dashboard';
import Modal from '../components/Modal';
import Page from '../components/PageFrame';
import UserNav from '../components/UserNav';
import { postAPI } from '../utils/models';

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
      console.log(retrievedObject.inviteToken);
      const formData = new FormData();
      formData.append('token', retrievedObject.inviteToken);

      toast.promise(postAPI(`join_organisation`, formData), {
        loading: 'Loading',
        success: () => {
          setIsTeamInvite(false);
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
          <Dashboard />
        </Page>
      )}
      <Modal
        isOpen={token && isTeamInvite}
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
