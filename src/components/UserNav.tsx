import React, { useEffect, Fragment } from 'react';
import { Box, Flex, Text, Container } from 'theme-ui';
import { Avatar } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
// import Container from '../../src/components/Container';
// relative
import Link from './NavLink';
import { Logo, UserIcon } from './Icons';
import { checkUser } from '../utils/models';
import { useRouter } from 'next/router';

export interface IUser {
  name: string;
}

const UserNav = () => {
  // const [user, setUser] = useState<IUser>();
  const router = useRouter();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);

  const onProfileLoad = (data: any) => {
    setProfile(data);

    if (data === 'x') {
      setProfile(data);
      // setUser(data);
    }
  };

  const onUserLogout = () => {
    userLogout();
    router.push('/');
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
    <Box>
      <Container>
        <Flex py={2} px={1} pl={0} pr={3}>
          <Box>
            <Link href={token ? '/user-profile' : '/'}>
              <Logo />
              {token}
            </Link>
          </Box>

          <Box>
            <Flex>
              {!token && (
                <Fragment>
                  <Link href="/signup">
                    <Text sx={{ px: 4, py: 2 }}>Join Wraft</Text>
                  </Link>
                  <Link href="/login">
                    <Text
                      sx={{
                        bg: 'blue',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: `8px`,
                        px: 4,
                        py: 2,
                        ml: 4,
                      }}>
                      Login
                    </Text>
                  </Link>
                </Fragment>
              )}
              {token && token !== '' && (
                <Flex ml={2} sx={{ alignContent: 'flex-start' }}>
                  {profile && (
                    <Text ml={2} pt={2} mr={3}>
                      {profile.name}
                    </Text>
                  )}
                  {profile && profile.profile_pic?.length > 0 && (
                    <Avatar
                      sx={{ height: '64px', width: '64px' }}
                      onClick={onUserLogout}
                      src={profile.profile_pic}
                    />
                  )}
                  {profile && profile.profile_pic === null && <UserIcon />}
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
export default UserNav;
