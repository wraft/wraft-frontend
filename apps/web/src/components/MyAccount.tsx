import React from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { UserCircle } from '@phosphor-icons/react';

import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';

const Form = () => {
  const { userProfile } = useAuth();

  return (
    <Box>
      {/* <Text fontSize={1} mb={3}>
        My Account
      </Text> */}
      <Flex pb={6}>
        <Box pt={0}>
          <UserCircle />
          {/* <Avatar
            variant="profile"
            src="https://randomuser.me/api/portraits/men/32.jpg"
          /> */}
        </Box>
        <Box>
          {userProfile && (
            <Box>
              <Text>{userProfile?.name}</Text>
              <Text>
                {userProfile?.age} - {userProfile?.location}
              </Text>
              <Box pt={3}>
                <Link href="/account/profile" variant="caps">
                  Edit Profile
                </Link>
              </Box>
              <Text variant="caps" pt={3}>
                {/* {profile.location} */}
                <Flex pt={3} sx={{ opacity: 0.75 }}>
                  {/* <Phone size={20} /> */}
                  {/* <Text pl={2}>+955 200 300</Text> */}
                </Flex>
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
      <Box mx={0} mb={3}>
        <Text mb={3}>Text</Text>
      </Box>
    </Box>
  );
};
export default Form;
