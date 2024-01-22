import React from 'react';

import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { Box, Flex, Text, Image } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';

import { Bell, ArrowBack } from './Icons';
import ModeToggle from './ModeToggle';
import Link from './NavLink';

export interface IUser {
  name: string;
}

interface INav {
  navtitle: string;
  onToggleEdit?: any;
}

const Nav = ({ navtitle, onToggleEdit }: INav) => {
  const { accessToken, userProfile, logout } = useAuth();

  return (
    <Box
      variant="header"
      sx={{
        p: 0,
        bg: 'neutral.100',
        borderBottom: 'solid 1px',
        borderColor: 'border',
        pt: 1,
        pb: 3,
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
      <Flex>
        <Box
          sx={{
            flexBasis: ['auto', '100%'],
            order: -1,
          }}>
          <Box
            sx={{
              p: 0,
              pt: 1,
              pl: 3,
              borderRight: 'solid 1px',
              borderColor: 'border',
              color: 'gray.900',
            }}>
            <Flex>
              <Link href="/contents">
                <ArrowBack width={22} />
              </Link>
              {navtitle && (
                <Text
                  onClick={onToggleEdit}
                  variant="navtitle"
                  sx={{ p: 2, pt: 1, fontWeight: 'heading' }}>
                  <Text
                    as="span"
                    sx={{
                      fontSize: '10.24px',
                      textTransform: 'uppercase',
                      fontWeight: 300,
                      display: 'block',
                    }}>
                    OFFLET
                  </Text>
                  <Text sx={{ fontSize: 2, fontWeight: 500 }}>{navtitle}</Text>
                </Text>
              )}
            </Flex>
          </Box>
        </Box>

        <Box ml="auto" mr={3}>
          <Flex>
            <Flex>
              <Box variant="button" sx={{ mt: 1, pt: 2, ml: 3 }}>
                <Bell width={22} />
              </Box>
            </Flex>
            {!accessToken && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
            {accessToken && accessToken !== '' && (
              <Flex ml={1}>
                {userProfile && (
                  <Flex
                    sx={{
                      alignContent: 'top',
                      verticalAlign: 'top',
                      mt: 2,
                    }}>
                    <Box>
                      <MenuProvider>
                        <MenuButton as={Box} sx={{ cursor: 'pointer' }}>
                          <Image
                            alt=""
                            sx={{ borderRadius: '3rem', bg: 'red' }}
                            width="32px"
                            height="32px"
                            src={userProfile?.profile_pic}
                            // src={`https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`} // image
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
                                  sx={{ fontSize: 0, color: 'text' }}>
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
        </Box>
      </Flex>
    </Box>
  );
};
export default Nav;
