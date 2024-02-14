import React, { Fragment } from 'react';
import { Box, Flex, Text, Container } from 'theme-ui';
import { Avatar } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import { UserIcon, BrandLogo } from './Icons';
import Link from './NavLink';

export interface IUser {
  name: string;
}

const UserNav = () => {
  const { logout, accessToken, userProfile } = useAuth();

  return (
    <Box
      sx={{
        bg: 'background',
        // borderBottom: 'solid 1px',
        // borderColor: 'border',
        py: 2,
      }}>
      <Container>
        <Flex sx={{ py: 3, px: 4, alignItems: 'center' }}>
          <Box sx={{ a: { p: 0, letterSpacing: 0 } }}>
            <Link href={accessToken ? '/user-profile' : '/'}>
              <Box sx={{ color: `gray.0`, fill: 'gray.1000' }}>
                <BrandLogo width="6rem" height="2rem" />
              </Box>
            </Link>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Flex>
              {!accessToken && (
                <Fragment>
                  <Link href="/signup">
                    <Text
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: 2,
                        fontWeight: 900,
                        color: '#343E49',
                      }}>
                      Join Wraft
                    </Text>
                  </Link>
                  <Link href="/pricing">
                    <Text
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: 2,
                        fontWeight: 900,
                        color: '#343E49',
                      }}>
                      Pricing
                    </Text>
                  </Link>

                  <Link href="/signup">
                    <Text
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: 2,
                        fontWeight: 900,
                        color: '#343E49',
                      }}>
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
              {accessToken && accessToken !== '' && (
                <Flex ml={2} sx={{ alignContent: 'flex-start' }}>
                  {userProfile && (
                    <Text ml={2} pt={2} mr={3}>
                      {userProfile.name}
                    </Text>
                  )}
                  {userProfile && userProfile.profile_pic?.length > 0 && (
                    <Avatar
                      sx={{ height: '64px', width: '64px' }}
                      onClick={logout}
                      src={userProfile.profile_pic}
                    />
                  )}
                  {userProfile && userProfile?.profile_pic === null && (
                    <UserIcon />
                  )}
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
