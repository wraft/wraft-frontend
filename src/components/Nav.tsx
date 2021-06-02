import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Text } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHotkeys } from 'react-hotkeys-hook';
// relative
import Link from './NavLink';
import { API_HOST, checkUser } from '../utils/models';
import { Bell, Plus } from '@styled-icons/boxicons-regular';

// import Dropdown from './common/Dropdown';
import Modal from './Modal';

// import { usePopper } from 'react-popper';

import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  // MenuSeparator,
} from 'reakit/Menu';
import { useDialogState } from 'reakit/Dialog';
import { Clickable } from 'reakit/Clickable';

import Blok from './Blok';

export interface IUser {
  name: string;
}

interface INav {
  navtitle?: string;
}

const Nav = ({ navtitle }: INav) => {
  // const [user, setUser] = useState<IUser>();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);

  const [showSearch, setShowSearch] = useState<boolean>(false);

  const menu = useMenuState();
  const dialog = useDialogState();

  // popper
  // const [toggleDrop, setToggleDrop] = useState<boolean>(false);
  // const [referenceElement, setReferenceElement] = useState(null);
  // const [popperElement, setPopperElement] = useState(null);
  // const [arrowElement, setArrowElement] = useState(null);
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  // });

  const onProfileLoad = (data: any) => {
    setProfile(data);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  useEffect(() => {
    // check if token is there
    const t = cookie.get('token') || false;
    // login to check
    if (t) {
      checkUser(t, onProfileLoad);
      setToken(t);
    }
  }, []);

  useHotkeys('/', () => {
    toggleSearch();
  });

  return (
    <Box
      variant="header"
      onClick={() =>closeSearch}
      sx={{
        p: 0,
        bg: 'gray.0',
        borderBottom: 'solid 1px',
        borderColor: 'gray.3',
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
              borderColor: 'gray.0',
              color: 'gray.8',
            }}>
            <Flex>
              <Clickable
                as={Box}
                onClick={() => toggleSearch()}
                sx={{
                  // pt: 0,
                  // bg: 'gray.2',
                  fontSize: 0,
                  color: 'gray.7',
                  border: 'solid 1px',
                  verticleAlign: 'top',
                  borderColor: 'gray.3',
                  mr: 2,
                  px: 1,
                  py: 0,
                  pb: 1,
                  pt: 1,
                  pr: 2,
                  '&:hover': {
                    bg: 'gray.1',
                    color: 'gray.9',
                    border: 'solid 1px',
                    borderColor: 'gray.2',
                  },
                  svg: {
                    fill: 'gray.5',
                  },
                  borderRadius: 4,
                }}>
                <Plus width="16px" />
                <Text as="span">New</Text>
              </Clickable>
              {/* <Button variant="btnPrimaryIcon" sx={{ fontSize: 0, fontWeight: 600, pt: 1 }} onClick={() => toggleSearch()}>New</Button> */}
              {/* <Link href="/contents">
                <Box color="gray.8" sx={{ ml: 3, mt: 2, fill: 'text' }}>
                  <Search width="20px" />
                </Box>
              </Link> */}
              {/* <Box>
                <Text as="h4">NDA between Bijoy and Functionary Labs Pvt Ltd</Text>
              </Box> */}
              {/* <Box variant="button" sx={{ mt: 1, pt: 2, ml: 3 }}>
                <Search width="20px" />
              </Box> */}
            </Flex>
          </Box>
        </Box>
        <Box ml="auto" mr={3}>
          {navtitle && <Text variant="navtitle">{navtitle}</Text>}
          <Flex sx={{ bg: 'gray.0' }}>
            <Flex sx={{ bg: 'gray.0', ':hover': { bg: 'gray.1' } }}>
              <Box variant="button" sx={{ mt: 1, pt: 1, px: 3 }}>
                <Bell width="20px" />
              </Box>
            </Flex>
            {!token && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
            {token && token !== '' && (
              <Flex ml={1}>
                {profile && (
                  <Flex
                    sx={{
                      alignContent: 'top',
                      verticalAlign: 'top',
                      mt: 2,
                    }}>
                    <Box>
                      <MenuButton as={Box} {...menu}>
                        <Image
                          sx={{ borderRadius: '3rem' }}
                          width="30px"
                          src={API_HOST + '/' + profile?.profile_pic}
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        // sx={{ border: 'solid 1px #eee' }}
                        {...menu}
                        sx={{ border: 'solid 1px #eee', minWidth: '20ch' }}
                        aria-label="Preferences">
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          <Box>
                            <Text as="h4">{profile?.name}</Text>
                            <Text as="p" sx={{ fontSize: 0, color: 'gray.6' }}>
                              Manager
                            </Text>
                          </Box>
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          Settings
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          Profile
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          onClick={userLogout}
                          {...menu}
                          sx={{ p: 3, bg: 'gray.0', borderBottom: 0 }}>
                          Signout
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
      <Modal dialog={dialog} isVisible={showSearch}>
        <Blok />
      </Modal>
    </Box>
  );
};
export default Nav;
