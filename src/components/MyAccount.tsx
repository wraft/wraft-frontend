import React from 'react';
import { Box, Flex, Text } from 'theme-ui';

// import { Phone } from '@styled-icons/boxicons-regular';
import { useStoreState } from 'easy-peasy';
import Link from './NavLink';

import { UserIcon } from './Icons';

const Form = () => {
  const profile = {
    name: 'Muneef Hameed',
    age: '29 M',
    location: 'Jabl Ali, Rusdha',
  };

  const profilex = useStoreState((state) => state.profile.data);

  return (
    <Box py={3}>
      {/* <Text fontSize={1} mb={3}>
        My Account
      </Text> */}
      <Flex pb={6}>
        <Box pt={0}>
          <UserIcon />
          {/* <Avatar
            variant="profile"
            src="https://randomuser.me/api/portraits/men/32.jpg"
          /> */}
        </Box>
        <Box pt={3} pl={6}>
          {profilex && (
            <Box>
              <Text>{profilex.name}</Text>
              <Text>
                {profile.age} - {profile.location}
              </Text>
              <Box pt={3}>
                <Link href="/account/profile" variant="caps">
                  <a>Edit Profile</a>
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
