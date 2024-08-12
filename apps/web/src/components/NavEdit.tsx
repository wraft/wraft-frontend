import React from 'react';
import { useRouter } from 'next/router';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { Box, Flex, Text, Image, Button as ButtonBase } from 'theme-ui';
import { ArrowLeft, Bell, LinkSimple } from '@phosphor-icons/react';

import { useAuth } from '../contexts/AuthContext';
import { EditIcon } from './Icons';
import ModeToggle from './ModeToggle';
import Link from './NavLink';
// import { Button } from './common';

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
        p: 0,
        bg: 'gray.100',
        borderBottom: 'solid 1px',
        borderColor: 'border',
        pt: 1,
        pb: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
      <Box
        sx={{
          flexBasis: ['auto', '100%'],
          order: -1,
        }}>
        <Box
          sx={{
            p: 0,
            pt: 1,
            pb: 1,
            pl: 2,

            // borderRight: 'solid 1px',
            // borderColor: 'border',
            color: 'gray.1200',
          }}>
          <Flex>
            {/* <BackIcon width={20} color="gray.1200" /> */}
            <Box sx={{ pt: 1 }}>
              <ArrowLeft cursor="pointer" onClick={goBack} size={18} />
            </Box>
            {navtitle && (
              <Flex
                onClick={onToggleEdit}
                variant="navtitle"
                sx={{
                  p: 0,
                  pt: 1,
                  ml: 2,

                  fontWeight: 'heading',
                  verticalAlign: 'middle',
                }}>
                {/* <Text
                    as="span"
                    sx={{
                      fontSize: '10.24px',
                      textTransform: 'uppercase',
                      fontWeight: 300,
                      display: 'block',
                    }}>
                    OFFLET
                  </Text> */}
                <Text sx={{ fontSize: 'sm', fontWeight: 500 }}>{navtitle}</Text>
                <EditIcon width={16} />
              </Flex>
            )}
          </Flex>
        </Box>
      </Box>

      <Flex ml="auto" mr={3}>
        <Flex ml={2}>
          <ButtonBase
            variant="btnSecondary"
            sx={{
              p: 0,
              height: 32,
              width: 32,
              border: 0,
              mr: 3,
              bg: 'transparent',
              ':hover': {
                bg: 'transparent',
              },
            }}>
            <LinkSimple size={20} />
          </ButtonBase>
        </Flex>
        <Flex
          sx={{
            borderLeft: 'solid 1px',
            borderColor: 'border',
            alignItems: 'center',
          }}>
          <Flex>
            <Box variant="button" sx={{ mt: 0, pt: 0, ml: 3, mr: 2 }}>
              <Bell size={20} />
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
                    mt: 0,
                  }}>
                  <Box>
                    <MenuProvider>
                      <MenuButton as={Box} sx={{ cursor: 'pointer' }}>
                        <Image
                          alt=""
                          sx={{ borderRadius: '3rem', bg: 'red' }}
                          width="28px"
                          height="28px"
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
