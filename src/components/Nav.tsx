import React, { useEffect } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';

// relative
import Link from './NavLink';
// import { UserIcon } from './Icons';
import { Image } from 'theme-ui';
import { checkUser } from '../utils/models';

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

  const onProfileLoad = (data: any) => {
    setProfile(data);
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
                  <Flex sx={{ alignContent: 'top', verticalAlign: 'top' }}>
                    {profile.profile_pic && (
                      <Image
                        src={'http://localhost:4000' + profile?.profile_pic}
                        sx={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          border: 'solid 1px #eee',
                        }}
                      />
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
