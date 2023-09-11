import React, { useEffect, Fragment } from 'react';
import { Box, Flex, Text, Container } from 'theme-ui';
import { Avatar } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
// import Container from '../../src/components/Container';
// relative
import Link from './NavLink';
import { UserIcon, BrandLogo } from './Icons';
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
    <Box
      sx={{
        bg: 'background',
        // borderBottom: 'solid 1px',
        // borderColor: 'gray.3',
        py: 2,
      }}>
      <Container>
        <Flex sx={{ py: 3, px: 4 }}>
          <Box>
            <Link
              href={token ? '/user-profile' : '/'}
              // sx={{
              //   p: 0,
              //   color: 'gray.0',
              //   fill: 'red',
              //   bg: 'red',
              //   display: 'block',
              //   svg: {
              //     color: 'green',
              //     display: 'block',
              //     path: { fill: 'yellow' },
              //     // fill: 'gray.9'
              //   },
              // }}
            >
              <Box sx={{ color: `gray.0`, fill: 'gray.9' }}>
                <BrandLogo width="6rem" height="2rem" />
              </Box>
            </Link>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Flex>
              {!token && (
                <Fragment>
                  <Link href="/signup">
                    <Text sx={{ px: 4, py: 2, fontSize: 2, fontWeight: 900 }}>
                      Join Wraft
                    </Text>
                  </Link>
                  <Link href="/pricing">
                    <Text sx={{ px: 4, py: 2, fontSize: 2, fontWeight: 900 }}>
                      Pricing
                    </Text>
                  </Link>

                  <Link href="/signup">
                    <Text sx={{ px: 4, py: 2, fontSize: 2, fontWeight: 900 }}>
                      Features
                    </Text>
                  </Link>
                  <Link href="/login">
                    <Text
                      sx={{
                        fontSize: 2,
                        bg: '#087F5B',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: `4px`,
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
