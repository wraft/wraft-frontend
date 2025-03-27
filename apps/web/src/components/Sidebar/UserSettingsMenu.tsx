import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DropdownMenu, Box, Flex, Text } from '@wraft/ui';
import { useColorMode, Image } from 'theme-ui';
import { Lightning } from '@phosphor-icons/react';

import Link from 'common/NavLink';
import ModeToggle from 'common/ModeToggle';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

type UserSettingsMenuProps = {
  size?: 'sm' | 'md';
};

const UserSettingsMenu = ({ size = 'md' }: UserSettingsMenuProps) => {
  const [mode, setMode] = useColorMode();
  const [count, setCount] = useState<number | undefined>();

  const router = useRouter();
  const { userProfile, accessToken, plan, logout } = useAuth();

  useEffect(() => {
    if (accessToken) {
      notificationCount();
    }
  }, [accessToken]);

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
      {accessToken && userProfile && (
        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <Image
              sx={{
                borderRadius: '3rem',
                cursor: 'pointer',
              }}
              alt=""
              width={size === 'sm' ? '18px' : ' 28px'}
              height={size === 'sm' ? '18px' : ' 28px'}
              src={userProfile?.profile_pic}
            />
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
                    <Text minWidth="180px">Notifications</Text>
                    {count && count > 0 && (
                      <Box minWidth="20px" pl="4px">
                        {count}
                      </Box>
                    )}
                  </Flex>
                </Link>
              </DropdownMenu.Item>

              {plan && plan.plan_amount === '0' && (
                <DropdownMenu.Item>
                  <Flex
                    bg="green.200"
                    w="100%"
                    py="xs"
                    px="xs"
                    justifyContent="space-between"
                    onClick={() => router.push('/manage/billing')}>
                    <Text w="100%">Upgrade Plan</Text>
                    <Lightning size={16} color="#127D5D" />
                  </Flex>
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item>
                <Link href="/account" path="/account">
                  <Text minWidth="200px">Settings</Text>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Text display="flex" flex={1} onClick={onUserLogout}>
                  Signout
                </Text>
              </DropdownMenu.Item>
            </Box>
          </DropdownMenu>
        </DropdownMenu.Provider>
      )}
    </>
  );
};

export default UserSettingsMenu;
