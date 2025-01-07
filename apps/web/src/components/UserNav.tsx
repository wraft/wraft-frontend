import React, { Fragment } from 'react';
import { Box, Flex, Text, Container } from 'theme-ui';
import { Avatar } from 'theme-ui';
import { BrandLogoIcon } from '@wraft/icon';
import { UserCircle } from '@phosphor-icons/react';

import Link, { NextLinkText } from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';

export interface IUser {
  name: string;
}

const UserNav = () => {
  const { logout, accessToken, userProfile } = useAuth();

  return (
    <Box
      sx={{
        py: 2,
      }}>
      <Container>
        <Flex sx={{ py: 3, px: 4, alignItems: 'center' }}>
          <Box sx={{ a: { p: 0, letterSpacing: 0 } }}>
            <Link href={accessToken ? '/user-profile' : '/'}>
              <Box sx={{ color: `gray.0`, fill: 'gray.1200' }}>
                <BrandLogoIcon width="6rem" height="2rem" />
              </Box>
            </Link>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Flex>
              {!accessToken && (
                <Fragment>
                  <NextLinkText variant="tertiaryLarge" href="features">
                    Features
                  </NextLinkText>
                  <NextLinkText variant="tertiaryLarge" href="use-cases">
                    Use Cases
                  </NextLinkText>
                  <NextLinkText variant="tertiaryLarge" href="login">
                    Login
                  </NextLinkText>
                  <NextLinkText variant="secondaryLarge" href="signup">
                    Request Invite
                  </NextLinkText>
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
                    <UserCircle size={32} />
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
