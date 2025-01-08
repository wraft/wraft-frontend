import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavLink from 'next/link';
import { Button, DropdownMenu, Box, Flex, Text, Modal } from '@wraft/ui';
import toast from 'react-hot-toast';
import { useColorMode, Image } from 'theme-ui';
import { Gear, Plus } from '@phosphor-icons/react';

import DefaultAvatar from 'components/DefaultAvatar';
import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, postAPI } from 'utils/models';

import WorkspaceCreate from '../manage/WorkspaceCreate';
import ModeToggle from '../ModeToggle';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createdId, setCreatedId] = useState<string>();
  const [mode, setMode] = useColorMode();
  const [count, setCount] = useState<number | undefined>();

  const router = useRouter();
  const { organisations, userProfile, accessToken, login, logout } = useAuth();

  useEffect(() => {
    if (createdId) onSwitchOrganization(createdId);
  }, [createdId]);

  useEffect(() => {
    notificationCount();
  }, []);

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

  const notificationCount = () => {
    fetchAPI('notifications/count').then((data: any) => {
      const res = data.count;
      setCount(res);
    });
  };

  const onUserLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during user logout:', error);
    }
  };

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        borderBottom="solid 1px"
        borderColor="border"
        h="72px"
        mb={3}>
        <Box>
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Flex cursor="pointer">
                {userProfile?.currentOrganisation && (
                  <Flex>
                    <DefaultAvatar
                      url={userProfile?.currentOrganisation?.logo}
                      value={userProfile?.currentOrganisation?.name}
                      size={32}
                    />

                    <Box ml="sm">
                      <Text fontWeight="bold" color="text-primary">
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <Text fontSize="sm" color="text-secondary">
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
                cursor="pointer"
                minWidth="200px"
                justifyContent="space-between">
                {userProfile?.currentOrganisation && (
                  <>
                    <Flex>
                      <DefaultAvatar
                        url={userProfile?.currentOrganisation?.logo}
                        value={userProfile?.currentOrganisation?.name}
                        size={28}
                      />
                      <Box ml="sm">
                        <Text fontWeight="bold" color="text-primary">
                          {userProfile?.currentOrganisation?.name}
                        </Text>
                        <Text fontSize="sm" color="text-secondary">
                          {userProfile?.currentOrganisation?.members_count}{' '}
                          members
                        </Text>
                      </Box>
                    </Flex>
                    <NavLink href={`/manage/workspace`}>
                      <Gear size={18} weight="bold" color="#777" />
                    </NavLink>
                  </>
                )}
              </Flex>

              <DropdownMenu.Separator />
              <Box overflowY="scroll" maxHeight="400px">
                {organisations &&
                  organisations
                    .filter(
                      (org: any) => org.id !== userProfile.organisation_id,
                    )
                    .map((org: any) => (
                      <DropdownMenu.Item
                        key={org.id}
                        onClick={() => onSwitchOrganization(org?.id)}>
                        <DefaultAvatar
                          url={org?.logo}
                          value={org.name}
                          size={20}
                        />
                        <Box ml={2}>{org.name}</Box>
                      </DropdownMenu.Item>
                    ))}
              </Box>
              <DropdownMenu.Separator />

              <DropdownMenu.Item>
                <Button variant="ghost" onClick={() => setIsOpen(true)}>
                  <Plus size={16} />
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
              <Box p={2} minWidth="200px">
                <Box
                  py="12px"
                  px="8px"
                  borderBottom="1px solid"
                  borderColor="border"
                  marginBottom="8px">
                  <Text as="h4">{userProfile?.name}</Text>

                  {userProfile?.roles?.size > 0 && (
                    <Text as="p" fontSize="xs" color="text">
                      {userProfile?.roles[0]?.name}
                    </Text>
                  )}
                </Box>

                <DropdownMenu.Item>
                  <Flex
                    flex={1}
                    onClick={() => {
                      const next = mode === 'dark' ? 'light' : 'dark';
                      setMode(next);
                    }}>
                    <Text as="span">Theme</Text>
                    <Box ml="auto">
                      <ModeToggle sx={{ pt: 0, m: 0 }} variant="button" />
                    </Box>
                  </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/notifications">
                    <Flex>
                      <Box minWidth="180px">Notifications</Box>
                      {count && count > 0 && (
                        <Box minWidth="20px" pl="4px">
                          {count}
                        </Box>
                      )}
                    </Flex>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/account" path="/account">
                    <Box minWidth="200px">Settings</Box>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Box display="flex" flex={1} onClick={onUserLogout}>
                    Signout
                  </Box>
                </DropdownMenu.Item>
              </Box>
            </DropdownMenu>
          </DropdownMenu.Provider>
        )}
      </Flex>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel="create workspace">
        <WorkspaceCreate setOpen={setIsOpen} setCreatedId={setCreatedId} />
      </Modal>
    </>
  );
};

export default Header;
