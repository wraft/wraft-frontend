import React from 'react';
import { useRouter } from 'next/router';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { Box, Flex, Text, Image } from 'theme-ui';
import { ArrowLeft, Bell, Pencil, Share } from '@phosphor-icons/react';

import { useAuth } from '../contexts/AuthContext';
import ModeToggle from './ModeToggle';
import Link from './NavLink';

export interface IUser {
  name: string;
}

interface INav {
  navtitle: string;
  onToggleEdit?: any;
  backLink?: string;
}

const Nav = ({ navtitle, onToggleEdit }: INav) => {
  const router = useRouter();
  const { accessToken, userProfile, logout } = useAuth();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Flex
      variant="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        alignItems: 'center',
        bg: 'gray.100',
        borderBottom: 'solid 1px',
        borderColor: 'border',
        py: 2,
        px: 3,
      }}>
      <Box
        sx={{
          flexBasis: ['auto', '100%'],
          order: -1,
        }}>
        <Box
          sx={{
            color: 'gray.1200',
          }}>
          <Flex sx={{ alignItems: 'center', gap: 3 }}>
            <ArrowLeft cursor="pointer" onClick={goBack} size={18} />

            {navtitle && (
              <Flex
                variant="navtitle"
                sx={{
                  alignItems: 'center',
                  fontWeight: 'heading',
                  verticalAlign: 'middle',
                  gap: 3,
                }}>
                <Text sx={{ fontSize: 'sm', fontWeight: 500 }}>{navtitle}</Text>

                <Pencil cursor="pointer" size={16} onClick={onToggleEdit} />
              </Flex>
            )}
          </Flex>
        </Box>
      </Box>

      <Flex ml="auto" sx={{ alignItems: 'center', gap: 3 }}>
        <Share size={18} cursor="pointer" />

        <Flex
          sx={{
            borderLeft: 'solid 1px',
            borderColor: 'border',
            alignItems: 'center',
            gap: 3,
            pl: 2,
          }}>
          <Bell size={18} />

          {!accessToken && (
            <Link href="/login">
              <Text>Login</Text>
            </Link>
          )}
          {accessToken && accessToken !== '' && (
            <Flex>
              {userProfile && (
                <Flex
                  sx={{
                    alignContent: 'top',
                    verticalAlign: 'top',
                    mt: 0,
                  }}>
                  <Box>
                    <MenuProvider>
                      <MenuButton
                        as={Box}
                        sx={{ cursor: 'pointer', display: 'flex' }}>
                        <Image
                          alt=""
                          sx={{ borderRadius: '3rem', bg: 'red' }}
                          width="18px"
                          height="18px"
                          src={userProfile?.profile_pic}
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        // sx={{ border: 'solid 1px #eee' }}
                        variant="layout.menuBlockWrapper"
                        aria-label="Preferences">
                        <MenuItem as={Box} variant="layout.menuItem">
                          <Box>
                            <Text as="h4">{userProfile?.name}</Text>

                            {userProfile?.roles?.size > 0 && (
                              <Text
                                as="p"
                                sx={{ fontSize: 'xxs', color: 'text' }}>
                                {userProfile?.roles[0]?.name}
                              </Text>
                            )}
                          </Box>
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          <Flex>
                            <Text>Theme</Text>
                            <Box
                              sx={{
                                // mb: 0,
                                ml: 'auto',
                              }}>
                              <ModeToggle
                                sx={{ pt: 0, m: 0 }}
                                variant="button"
                              />
                            </Box>
                          </Flex>
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          Settings
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          Profile
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          onClick={logout}
                          variant="layout.menuItem">
                          Signout
                        </MenuItem>
                      </Menu>
                    </MenuProvider>
                  </Box>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Nav;
