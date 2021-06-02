import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Input, Text } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHotkeys } from 'react-hotkeys-hook';
// relative
import Link from './NavLink';
import { API_HOST, checkUser } from '../utils/models';
import { Bell, Search, Exit, Plus } from '@styled-icons/boxicons-regular';
import Dropdown from './common/Dropdown';

// import { usePopper } from 'react-popper';

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
      sx={{
        p: 0,
        bg: 'gray.0',
        borderBottom: 'solid 1px',
        borderColor: 'gray.3',
        pt: 1,
        pb: 3,
      }}>
      <Flex>
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
              <Box sx={{ pt: 0, bg: 'gray.2', color: 'gray.9', border: 'solid 1px #ddd', mr: 2}}>
                <Plus width="20px" />
              </Box>
              {/* <Button variant="btnPrimaryIcon" sx={{ fontSize: 0, fontWeight: 600, pt: 1 }} onClick={() => toggleSearch()}>New</Button> */}
              <Link href="/contents">
                <Box color="gray.8" sx={{ ml: 3, mt: 2, fill: 'text' }}>
                  <Search width="20px" />
                </Box>
              </Link>
              {/* <Box>
                <Text as="h4">NDA between Bijoy and Functionary Labs Pvt Ltd</Text>
              </Box> */}
              {/* <Box variant="button" sx={{ mt: 1, pt: 2, ml: 3 }}>
                <Search width="20px" />
              </Box> */}
            </Flex>
          </Box>
        </Box>
        {navtitle && <Text variant="navtitle">{navtitle}</Text>}
        <Box ml="auto" mr={3}>
          <Flex>
            <Flex>
              <Box variant="button" sx={{ mt: 1, pt: 2, ml: 3 }}>
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
                    <Dropdown imageUrl={API_HOST + '/' + profile?.profile_pic}>
                      <Box
                        sx={{
                          color: 'gray.8',
                          pl: 3,
                          pt: 2,
                          pb: 2,
                          pr: 3,
                          right: 2,
                          borderRadius: 3,
                          ':hover': { bg: 'gray.2', color: 'gray.8' },
                        }}
                        // ref={setPopperElement}
                        // style={styles.popper}
                        // {...attributes.popper}
                      >
                        <>
                          <Text sx={{ fontWeight: 500, pb: 1 }}>
                            {profile?.name}
                          </Text>
                          <Text sx={{ pt: 1, pb: 2 }}>Settings</Text>
                          <Text onClick={userLogout}>
                            Sign out <Exit width={16} />
                          </Text>
                        </>
                      </Box>
                    </Dropdown>
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
