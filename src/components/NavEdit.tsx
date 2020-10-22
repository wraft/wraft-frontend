import React, { useEffect } from 'react';
import { Box, Flex, Text } from 'rebass';
import styled from 'styled-components';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';

// relative
import Link from './NavLink';
// import { UserIcon } from './Icons';
import { Image } from 'theme-ui';
import { API_HOST, checkUser } from '../utils/models';

const Header = styled(Box)`
  border-bottom: solid 1px #eee;
  padding-bottom: 12px;
  padding-top: 12px;
  padding-left: 12px;
  padding-left: 24px;
  border-bottom: solid 1px #eee;
`;

export interface IUser {
  name: string;
}

interface INav {
  navtitle?: string;
}

const NavEdit = ({ navtitle = 'Page Title' }: INav) => {
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
    <Header>
      <Flex py={2} px={1} pl={0} pr={3}>
        <Link href="/">
        ← Back
        </Link>
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
                        src={API_HOST + profile?.profile_pic}
                        sx={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          border: 'solid 1px #eee',
                        }}
                      />
                    )}
                    <Text onClick={() => userLogout}>Logout</Text>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Header>
  );
};
export default NavEdit;
