import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Flex, Image, Text, Input } from 'theme-ui';
import { BellIcon, SearchIcon } from '@wraft/icon';

import CreateDocument from 'components/DocumentCreate';
import Modal from 'common/Modal';
import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';

export interface IUser {
  name: string;
}

interface INav {
  navtitle?: string;
}

/**
 *  Nav Component
 * @param param0
 * @returns
 */
const Nav = ({ navtitle }: INav) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { userProfile, accessToken, logout } = useAuth();
  const router = useRouter();

  const userLogout = () => {
    logout();
    router.push('/');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  useHotkeys('/', () => {
    toggleSearch();
  });

  return (
    <Box
      variant="header"
      // onClick={() =>closeSearch}
      sx={{
        p: 0,
        bg: 'white',
        borderBottom: 'solid 1px',
        borderColor: 'border',
        pt: 0,
        pb: 2,
      }}>
      <Flex sx={{ pt: 2 }}>
        <Box
          sx={{
            flexBasis: ['auto', 200],
            order: -1,
          }}>
          <Box
            sx={{
              p: 0,
              pt: 1,
              pl: 3,
              borderRight: 'solid 1px',
              borderColor: 'border',
              color: 'text-primary',
              pb: 1,
            }}>
            <Flex sx={{ minWidth: '80ch' }}>
              <Flex variant="button" sx={{ mt: 0, pt: 0, ml: 3 }}>
                {/* <ButtonLink onToggleSearch={toggleSearch} /> */}
                <Flex
                  sx={{
                    position: 'relative',
                    height: '40px',
                    width: '80ch',
                    border: 'solid 1px #ddd',
                    borderRadius: '4px',
                  }}>
                  <Input
                    variant="small"
                    placeholder="Search for docs"
                    sx={{
                      borderRadius: 0,
                      width: '130% !important',
                      fontSize: 'xs',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      pl: 2,
                      right: 1,
                      top: 0,
                      pt: 1,
                      bottom: 0,
                      borderLeft: 'solid 1px',
                      borderColor: 'border',
                      svg: {
                        fill: 'gray.900',
                        pr: 2,
                      },
                    }}>
                    <SearchIcon width={28} height={28} />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Box>
        <Box ml="auto" mr={3}>
          {navtitle && <Text variant="navtitle">{navtitle}</Text>}
          <Flex>
            <Flex sx={{ ':hover': { bg: 'background-secondary' } }}>
              <Box as="span" sx={{ mt: 2 }}></Box>

              <Box
                variant="button"
                sx={{ mt: 1, pt: 1, px: 3, svg: { fill: 'gray.700' } }}>
                <Link href="/activities">
                  <BellIcon width={20} height={20} />
                </Link>
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
                      // mt: 2,
                    }}>
                    <Box>
                      <MenuProvider>
                        <MenuButton as={Box}>
                          <Image
                            alt=""
                            sx={{ borderRadius: '3rem' }}
                            width="30px"
                            // src={API_HOST + '/' + userProfile?.profile_pic}
                            src={`https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`} // image
                          />
                        </MenuButton>
                        <Menu
                          as={Box}
                          sx={{ border: 'solid 1px #eee', minWidth: '20ch' }}
                          aria-label="Preferences">
                          <MenuItem
                            as={Box}
                            sx={{
                              p: 3,
                              py: 2,
                              bg: 'gray.100',
                              borderBottom: 'solid 1px #eee',
                              '&:hover': {
                                bg: 'background-secondary',
                              },
                            }}>
                            <Box>
                              <Text as="h4">{userProfile?.name}</Text>

                              {userProfile?.roles?.size > 0 && (
                                <Text
                                  as="p"
                                  sx={{
                                    fontSize: 'xs',
                                    color: 'text-primary',
                                  }}>
                                  {userProfile?.roles[0]?.name}
                                </Text>
                              )}
                            </Box>
                          </MenuItem>
                          <MenuItem
                            as={Box}
                            sx={{
                              p: 3,
                              py: 2,
                              bg: 'gray.100',
                              borderBottom: 'solid 1px #eee',
                              '&:hover': {
                                bg: 'background-secondary',
                              },
                            }}>
                            Settings
                          </MenuItem>
                          <MenuItem
                            as={Box}
                            sx={{
                              p: 3,
                              py: 2,
                              bg: 'gray.100',
                              borderBottom: 'solid 1px #eee',
                              '&:hover': {
                                bg: 'background-secondary',
                              },
                            }}>
                            Profile
                          </MenuItem>
                          <MenuItem
                            as={Box}
                            onClick={userLogout}
                            sx={{ p: 3, bg: 'gray.100', borderBottom: 0 }}>
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
      <Modal isOpen={showSearch} onClose={closeSearch}>
        <CreateDocument />
      </Modal>
    </Box>
  );
};
export default Nav;
