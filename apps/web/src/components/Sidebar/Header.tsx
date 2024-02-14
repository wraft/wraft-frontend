import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, DropdownMenu } from '@wraft/ui';
import toast from 'react-hot-toast';
import { Box, Flex, Image, Text, useColorMode } from 'theme-ui';

import Link from '../../components/NavLink';
import { useAuth } from '../../contexts/AuthContext';
import { postAPI } from '../../utils/models';
import WorkspaceCreate from '../manage/WorkspaceCreate';
import Modal from '../Modal';
import ModeToggle from '../ModeToggle';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createdId, setCreatedId] = useState<string>();
  const [mode, setMode] = useColorMode();

  const router = useRouter();
  const { organisations, userProfile, accessToken, login, logout } = useAuth();

  useEffect(() => {
    if (createdId) onSwitchOrganization(createdId);
  }, [createdId]);

  const onSwitchOrganization = async (id: string) => {
    const organRequest = postAPI('switch_organisations', {
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

    toast.promise(organRequest, {
      loading: 'switching...',
      success: <b>Switched workspace!</b>,
      error: <b>Could not switch workspace.</b>,
    });
  };

  const onUserlogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 'solid 1px',
          borderColor: 'border',
          height: '72px',
          p: 3,
          mb: 3,
        }}>
        <Box>
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Flex color="primary" sx={{ fill: 'text', cursor: 'pointer' }}>
                {userProfile?.currentOrganisation && (
                  <Flex>
                    <Image
                      src={userProfile?.currentOrganisation?.logo}
                      width={24}
                      height={24}
                      alt="Workspace"
                      sx={{
                        borderRadius: '99rem',
                        height: `24px`,
                        width: `24px`,
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Text
                        as="p"
                        sx={{
                          fontWeight: `bold`,
                          color: 'gray.1000',
                          lineHeight: 1,
                          fontSize: 1,
                        }}>
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <Text as="p" sx={{ fontSize: 1, color: 'gray.400' }}>
                        {userProfile?.currentOrganisation?.members_count}{' '}
                        members
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu aria-label="Switch Workspace">
              <Flex
                color="primary"
                py="12px"
                px="8px"
                sx={{ fill: 'text', cursor: 'pointer', minWidth: '200px' }}>
                {userProfile?.currentOrganisation && (
                  <Flex>
                    <Image
                      src={userProfile?.currentOrganisation?.logo}
                      width={24}
                      height={24}
                      alt="Workspace"
                      sx={{
                        borderRadius: '99rem',
                        height: `24px`,
                        width: `24px`,
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Text
                        as="p"
                        sx={{
                          fontWeight: `bold`,
                          color: 'gray.1000',
                          lineHeight: 1,
                          fontSize: 1,
                        }}>
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <Text as="p" sx={{ fontSize: 1, color: 'gray.400' }}>
                        {userProfile?.currentOrganisation?.members_count}{' '}
                        members
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Flex>
              <DropdownMenu.Separator />
              {organisations &&
                organisations.map((org: any) => (
                  <DropdownMenu.Item
                    key={org.id}
                    onClick={() => onSwitchOrganization(org?.id)}>
                    <Image
                      src={org?.logo}
                      width={24}
                      height={24}
                      alt="Workspace"
                      sx={{
                        borderRadius: '99rem',
                        height: `18px`,
                        width: `18px`,
                        mr: 2,
                      }}
                    />
                    {org.name}
                  </DropdownMenu.Item>
                ))}
              <DropdownMenu.Separator />

              <DropdownMenu.Item>
                <Button variant="ghost" onClick={() => setIsOpen(true)}>
                  Create or join a workspace
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu>
          </DropdownMenu.Provider>
        </Box>

        {accessToken && userProfile && (
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Box>
                <Image
                  sx={{
                    borderRadius: '3rem',
                    bg: 'red',
                    cursor: 'pointer',
                  }}
                  alt=""
                  width="28px"
                  height="28px"
                  src={userProfile?.profile_pic}
                />
              </Box>
            </DropdownMenu.Trigger>
            <DropdownMenu aria-label="Preferences">
              <Box py="12px" px="8px">
                <Text as="h4">{userProfile?.name}</Text>

                {userProfile?.roles?.size > 0 && (
                  <Text as="p" sx={{ fontSize: 0, color: 'text' }}>
                    {userProfile?.roles[0]?.name}
                  </Text>
                )}
              </Box>

              <DropdownMenu.Item>
                <Flex
                  onClick={() => {
                    const next = mode === 'dark' ? 'light' : 'dark';
                    setMode(next);
                  }}>
                  <Text>Theme</Text>
                  <Box
                    sx={{
                      // mb: 0,
                      ml: 'auto',
                    }}>
                    <ModeToggle sx={{ pt: 0, m: 0 }} variant="button" />
                  </Box>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Link href="/account" path="/account">
                  Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Link href="/account/profile" path="/account/profile">
                  Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Box onClick={onUserlogout}>Signout</Box>
              </DropdownMenu.Item>
            </DropdownMenu>
          </DropdownMenu.Provider>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <WorkspaceCreate setOpen={setIsOpen} setCreatedId={setCreatedId} />
      </Modal>
    </>
  );
};

export default Header;
