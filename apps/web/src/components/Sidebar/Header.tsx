import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavLink from 'next/link';
import { Button, DropdownMenu } from '@wraft/ui';
import toast from 'react-hot-toast';
import { Box, Flex, Image, Text, useColorMode } from 'theme-ui';
import { Gear, Plus } from '@phosphor-icons/react';

import Link from 'components/NavLink';
import DefaultAvatar from 'components/DefaultAvatar';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, postAPI } from 'utils/models';

import WorkspaceCreate from '../manage/WorkspaceCreate';
import Modal from '../Modal';
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
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 'solid 1px',
          borderColor: 'border',
          height: '72px',
          // p: 3,
          mb: 3,
        }}>
        <Box>
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Flex color="primary" sx={{ fill: 'text', cursor: 'pointer' }}>
                {userProfile?.currentOrganisation && (
                  <Flex>
                    <DefaultAvatar
                      url={userProfile?.currentOrganisation?.logo}
                      value={userProfile?.currentOrganisation?.name}
                      size={24}
                    />

                    <Box ml={2}>
                      <Text
                        as="p"
                        sx={{
                          fontWeight: `bold`,
                          color: 'gray.1200',
                          lineHeight: 1,
                          fontSize: 'sm',
                        }}>
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <Text as="p" sx={{ fontSize: 'xs', color: 'gray.1000' }}>
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
                sx={{
                  fill: 'text',
                  cursor: 'pointer',
                  minWidth: '200px',
                  justifyContent: 'space-between',
                }}>
                {userProfile?.currentOrganisation && (
                  <>
                    <Flex>
                      <DefaultAvatar
                        url={userProfile?.currentOrganisation?.logo}
                        value={userProfile?.currentOrganisation?.name}
                        size={24}
                      />
                      <Box ml={2}>
                        <Text
                          as="p"
                          sx={{
                            fontWeight: `bold`,
                            color: 'gray.1000',
                            lineHeight: 1,
                            fontSize: 'xs',
                          }}>
                          {userProfile?.currentOrganisation?.name}
                        </Text>
                        <Text as="p" sx={{ fontSize: 'xs', color: 'gray.800' }}>
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
              <Box
                variant="styles.scrollbarY"
                sx={{
                  height: '400px',
                }}>
                {organisations &&
                  organisations.map((org: any) => (
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
              <Box p={2} sx={{ minWidth: '200px' }}>
                <Box
                  py="12px"
                  px="8px"
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'border',
                    marginBottom: '8px',
                  }}>
                  <Text as="h4">{userProfile?.name}</Text>

                  {userProfile?.roles?.size > 0 && (
                    <Text as="p" sx={{ fontSize: 'xxs', color: 'text' }}>
                      {userProfile?.roles[0]?.name}
                    </Text>
                  )}
                </Box>

                <DropdownMenu.Item>
                  <Flex
                    sx={{ flex: 1 }}
                    onClick={() => {
                      const next = mode === 'dark' ? 'light' : 'dark';
                      setMode(next);
                    }}>
                    <Text as="span">Theme</Text>
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
                  <Link href="/notifications">
                    <Flex>
                      <Box sx={{ width: '180px' }}>Notifications</Box>
                      {count > 0 && (
                        <Box sx={{ width: '20px', pl: '4px' }}>{count}</Box>
                      )}
                    </Flex>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/account" path="/account">
                    <Box sx={{ width: '200px' }}>Settings</Box>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Box sx={{ display: 'flex', flex: 1 }} onClick={onUserLogout}>
                    Signout
                  </Box>
                </DropdownMenu.Item>
              </Box>
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
