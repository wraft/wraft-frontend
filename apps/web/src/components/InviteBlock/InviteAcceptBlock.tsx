import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text } from '@wraft/ui';
import { BrandLogoIcon } from '@wraft/icon';
import { Button } from '@wraft/ui';

import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';
import { postAPI, verifyInvite } from 'utils/models';

export interface IField {
  name: string;
  value: string;
}

interface InviteAcceptBlockProps {
  isAuthorised: boolean | null;
  inviteToken: string | null;
}

const InviteAcceptBlock = ({
  isAuthorised,
  inviteToken,
}: InviteAcceptBlockProps) => {
  const router = useRouter();

  const { updateOrganisations, login } = useAuth();
  const homePageUrl = process.env.homePageUrl || '/';
  const [verifyData, setVerifyData] = useState<any>();

  useEffect(() => {
    if (isAuthorised) {
      verifyInviteToken(inviteToken);
    }
  }, [isAuthorised]);

  const verifyInviteToken = async (token: any) => {
    try {
      const response = await verifyInvite(token);
      setVerifyData(response);
    } catch (error) {
      toast.error('invailed token', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const onAcceptInvitation = async () => {
    const formData = new FormData();
    formData.append('token', inviteToken || '');

    try {
      const data: any = await postAPI('join_organisation', formData);
      await toast.success('Successfully joined!');
      updateOrganisations();
      if (data?.organisation?.id) {
        onSwitchOrganization(data?.organisation?.id);
      } else {
        router.push('/');
      }
    } catch (error) {
      await toast.error('Failed to join. Please try again.');
    }
  };

  const onSwitchOrganization = async (id: string) => {
    postAPI('switch_organisations', {
      organisation_id: id,
    })
      .then((res: any) => {
        login(res);
        router.push('/');
      })
      .catch(() => {
        toast.error('failed Switch', {
          duration: 1000,
          position: 'top-center',
        });
      });
  };

  return (
    <>
      <Flex
        justify="center"
        p="5xl"
        bg="background-secondary"
        h="100vh"
        align="baseline">
        <Box position="absolute" top="80px" left="80px">
          <Link href={homePageUrl}>
            <Box color="gray.0" fill="gray.1200">
              <BrandLogoIcon width="7rem" height="3rem" />
            </Box>
          </Link>
        </Box>

        <Flex
          variant="card"
          w="500px"
          justifySelf="center"
          direction="column"
          textAlign="center">
          {isAuthorised && (
            <>
              <Text as="h3" mb="md" fontSize="3xl">
                Invitation to join
              </Text>
              <Text as="p" color="text-secondary" mb="xxl">
                You have been invited to join
                <Text as="span" fontWeight="bold" display="inline" px="xs">
                  {verifyData?.organisation?.name}
                </Text>{' '}
                Organisation
              </Text>
              <Flex gap="sm" justify="center">
                <Button onClick={onAcceptInvitation}>Accept</Button>
                <Button variant="tertiary" onClick={() => router.push('/')}>
                  Go Home Page
                </Button>
              </Flex>
              <Flex gap="sm" mt="md">
                <Text as="p" color="text-secondary" mb="md">
                  By Joining the waiting list, I agree to Wraft&apos;s{' '}
                </Text>
                <Link href="/">
                  <Text color="primary">Privacy Policy.</Text>
                </Link>
              </Flex>
            </>
          )}
          {!isAuthorised && (
            <>
              <Text as="h3" mb="md" fontSize="3xl">
                Access Restricted
              </Text>
              <Text color="text-secondary">
                You are signed in with an unauthorized account. Please log out
                and use the correct account to continue.
              </Text>
              <Box mt="md">
                <Button onClick={() => router.push('/')}>Go Home Page</Button>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default InviteAcceptBlock;
