import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';

// relative
import Link from './NavLink';
// import { UserIcon } from './Icons';
import { Image } from 'theme-ui';
import { API_HOST, checkUser } from '../utils/models';
import { Exit } from '@styled-icons/boxicons-solid';

// import { usePopper } from 'react-popper';

export interface IUser {
  name: string;
}

interface INav {
  navtitle?: string;
}

const Nav = ({ navtitle = '' }: INav) => {
  // const [user, setUser] = useState<IUser>();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState(state => state.auth.token);
  const profile = useStoreState(state => state.profile.profile);

  // popper
  const [toggleDrop, setToggleDrop] = useState<boolean>(false);
  // const [referenceElement, setReferenceElement] = useState(null);
  // const [popperElement, setPopperElement] = useState(null);
  // const [arrowElement, setArrowElement] = useState(null);
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  // });

  const onProfileLoad = (data: any) => {
    setProfile(data);
  };

  /**
   * Toggle Dropdown
   */

  const toggleDropDown = () => {
    setToggleDrop(!toggleDrop);
  };

  useEffect(() => {
    // check if token is there
    const t = cookie.get('token') || false;
    // login to check
    if (t) {
      // if(t === '') {
      //   checkUser(t, onProfileLoad)
      // }
      checkUser(t, onProfileLoad);
      setToken(t);
    }
    // check if cooke token is present
    // if so set it as state, and then call the user object
  }, []);

  return (
    <Box variant="header">
      <Flex py={2} px={1} pl={0} pr={3}>
        {/* <Link href="/"><Logo /></Link> */}
        {navtitle && <Text variant="navtitle">{navtitle}</Text>}
        <Box ml="auto" mr={3}>
          <Flex>
            {!token && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
            {token && token !== '' && (
              <Flex ml={2}>
                {profile && (
                  <Flex
                    sx={{
                      alignContent: 'top',
                      verticalAlign: 'top',
                      bg: 'gray.2',
                    }}>
                    {profile.profile_pic && (
                      <>
                        <Image
                          // ref={setReferenceElement}
                          onClick={toggleDropDown}
                          src={API_HOST + '/' + profile?.profile_pic?.file_name}
                          sx={{
                            ml: 'auto',
                            width: '100%',
                            maxWidth: '40px',
                            height: '100%',
                            borderRadius: '33rem',
                            // border: 'solid 1px #eee',
                          }}
                        />
                        {/* <div ref={setArrowElement} style={styles.arrow} /> */}
                        {/* <div style={styles.arrow} /> */}
                      </>
                    )}
                    {/* <Button type="button" sx={{ bg: 'transparent'}} >
                      <DownArrow width={12} height={12} color="#000" />
                    </Button> */}
                    {toggleDrop && (
                      <Box
                        sx={{
                          color: 'gray.8',
                          pl: 3,
                          pt: 2,
                          pb: 2,
                          pr: 3,
                          right: 3,
                          // bg: 'gray.1',
                          borderRadius: 3,
                          border: 'solid 1px',
                          borderColor: 'gray.3',
                          boxShadow: '0 0 4rem #00000042',
                          ':hover': { bg: 'gray.2', color: 'gray.8' },
                        }}
                        // ref={setPopperElement}
                        // style={styles.popper}
                        // {...attributes.popper}
                        >
                        <>
                          <Text sx={{ fontWeight: 500, pb: 1}}>{profile?.name}</Text>
                          <Text sx={{ pt: 1, pb: 2}}>Settings</Text>
                          <Text onClick={() => userLogout}>Sign out <Exit width={16} /></Text>
                        </>
                      </Box>
                    )}
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
