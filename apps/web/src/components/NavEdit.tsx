import React from 'react';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { Box, Flex, Text, Image } from 'theme-ui';
import {
  ArrowLeft,
  Bell,
  // LinkSimple,
  Pencil,
  Share,
  // UserPlus,
} from '@phosphor-icons/react';
import { Button } from '@wraft/ui';

import { useAuth } from '../contexts/AuthContext';
// import { EditIcon } from './Icons';
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

const Nav = ({ navtitle, onToggleEdit, backLink }: INav) => {
  const { accessToken, userProfile, logout } = useAuth();

  return (
    <Flex
      variant="header"
      sx={{
        p: 0,
        bg: 'gray.100',
        borderBottom: 'solid 1px',
        borderColor: 'border',
        // pt: 1,
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
            pt: 0,
            // pb: 1,
            pl: 2,

            // borderRight: 'solid 1px',
            // borderColor: 'border',
            color: 'gray.1200',
          }}>
          <Flex>
            <Link href={backLink ? backLink : '/contents'}>
              {/* <BackIcon width={20} color="gray.1200" /> */}
              <Box sx={{ pt: 2 }}>
                <ArrowLeft size={16} />
              </Box>
            </Link>

            {navtitle && (
              <Flex
                variant="navtitle"
                sx={{
                  p: 0,
                  pt: 2,
                  ml: 2,

                  fontWeight: 'heading',
                  verticalAlign: 'middle',
                }}>
                <Text sx={{ fontSize: 'sm', fontWeight: 500 }}>{navtitle}</Text>
                <Button variant="ghost" onClick={onToggleEdit}>
                  <Pencil size={16} />
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>
      </Box>

      <Flex ml="auto" mr={3}>
        <Flex ml={2}>
          <Button variant="ghost">
            <Share size={16} />
          </Button>
        </Flex>
        <Flex
          sx={{
            borderLeft: 'solid 1px',
            borderColor: 'border',
            alignItems: 'center',
          }}>
          <Flex>
            <Box sx={{}}>
              <Button variant="ghost">
                <Bell size={18} />
              </Button>
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
