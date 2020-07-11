import React, { useState } from 'react';
import { Flex, Box, Text } from 'rebass';
import Container from './Container';
// import Field from './Field';
// import { format } from 'date-fns';
// import Link from './NavLink';
// import ProfilePopup from './ProfilePopup';
import { format } from 'date-fns';

import { useStoreState } from 'easy-peasy';

const UserProfileBlock = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [activeModal, setActiveModal] = useState<string>();
  // const [activeData, setActiveData] = useState<any>();
  const profile = useStoreState(state => state.profile.profile);

  // const closeModal = () => {
  //   setShowModal(false);
  // };

  const toggleModal = () => {
    // setActiveModal(formid)
    // setActiveData(data)
    setShowModal(!showModal);
  };

  return (
    <Box py={8}>
      <Box>
        <Container width={70} bg={''}>
          <Flex alignItems="center" justifyContent="space-between" mt={5}>
            <Text fontSize={2}>My profile</Text>
            <Text fontSize={0} fontWeight="bold">
              Rewards: 0 points
            </Text>
          </Flex>
        </Container>
      </Box>

      <Box mt={6}>
        <Container width={70} bg={''}>
          <Flex mx={-4}>
            <Box width={1 / 4} p={3} mx={4} sx={{ border: '1px solid #ccc' }}>
           
              {profile &&
                profile.user &&
                profile.user.addresses &&
                profile.user.addresses.map((item: any, i: number) => (
                  <Box
                    mb={3}
                    pb={3}
                    sx={{ borderBottom: '1px solid #ccc' }}
                    key={i}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text my={3}>Address {i + 1}</Text>
                      <Text my={3} color="primary" onClick={()=> toggleModal()}>Edit</Text>
                    </Flex>
                    <Text fontWeight={0} color="#b3b3b3">
                      {`${item.address1} ${
                        item.address2 == null ? '' : item.address2
                      } ${item.address3 == null ? '' : item.address3}`}
                    </Text>
                    <Text color="#b3b3b3" mt={2}>
                      Sat, Sun, Mon, Tue, Wed, Thu, Fri
                    </Text>
                  </Box>
                ))}
            </Box>
            <Box width={1 / 4} mx={4}>
              <Box p={3} sx={{ border: '1px solid #ccc' }}>
                <Text my={2}>Nutrition info</Text>
                <Flex mb={1} justifyContent="space-between">
                  <Text color="#b3b3b3">Calorie per day</Text>
                  <Text color="#b3b3b3">{profile?.nutrition_info?.calories_per_day?.range_start} - {profile?.nutrition_info?.calories_per_day?.range_end}</Text>
                </Flex>
                { profile?.nutrition_info?.protien &&
                  <Flex mb={1} justifyContent="space-between">
                    <Text color="#b3b3b3">Protein</Text>
                    <Text color="#b3b3b3">150 - 170</Text>
                  </Flex>
                }
                { profile?.nutrition_info?.carbohydrate &&
                  <Flex mb={1} justifyContent="space-between">
                    <Text color="#b3b3b3">Carbohydrates</Text>
                    <Text color="#b3b3b3">100 - 120</Text>
                  </Flex>
                }
                { profile?.nutrition_info?.fat &&
                  <Flex mb={1} justifyContent="space-between">
                    <Text color="#b3b3b3">Fat</Text>
                    <Text color="#b3b3b3">35 - 45</Text>
                  </Flex>
                }
              </Box>
              <Box p={3} mt={3} sx={{ border: '1px solid #ccc' }}>
                
                <Flex justifyContent="space-between" alignItems="center">
                  <Text my={2}>Bio profile</Text>
                  <Text my={2} color="primary" onClick={()=> toggleModal()}>Edit</Text>
                </Flex>
                {/* <Link href="/user-profile/edit">Edit</Link> */}
                <Flex mb={2} justifyContent="space-between">
                  <Text color="#b3b3b3">Height</Text>
                  <Text color="#b3b3b3">{`${profile?.bio_profile?.height == null ? '' : `${profile?.bio_profile?.height} cm`}`} </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between">
                  <Text color="#b3b3b3">Weight</Text>
                  <Text color="#b3b3b3">{`${profile?.bio_profile?.weight == null ? '' : `${profile?.bio_profile?.weight} kg`}`}</Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between">
                  <Text color="#b3b3b3">D.O.B</Text>
                  <Text color="#b3b3b3"> {`${profile?.bio_profile?.dob == null ? '' : format(new Date(profile?.bio_profile?.dob), 'dd LLL, yyyy')}`}</Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between">
                  <Text color="#b3b3b3">Gender</Text>
                  <Text color="#b3b3b3">{`${profile?.bio_profile?.gender == null ? '' : profile?.bio_profile?.gender}`}</Text>
                </Flex>
              </Box>
              <Box p={3} mt={3} sx={{ border: '1px solid #ccc' }}>
                <Text my={2}>Contact info</Text>
                <Text mb={1} color="#b3b3b3">
                  Mob:{' '}
                  {profile &&
                    profile.user &&
                    profile.user.contact_info &&
                    profile.user.contact_info.mob}
                </Text>
                <Text mb={1} color="#b3b3b3">
                  {profile &&
                    profile.user &&
                    profile.user.contact_info &&
                    profile.user.contact_info.email}
                </Text>
              </Box>
            </Box>
            <Box width={1 / 4} mx={4}>
              <Box p={3} sx={{ border: '1px solid #ccc' }}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text my={2}>Allergies & Dislikes</Text>
                  <Text my={2} color="primary" onClick={()=> toggleModal()}>Add</Text>
                </Flex>
                {profile &&
                  profile.user &&
                  profile.user.allergys &&
                  profile.user.allergys.map((item: any, i: number) => (
                    <Text mb={1} color="#b3b3b3" key={i}>
                      {item.name}
                    </Text>
                  ))}
              </Box>
              <Box p={3} mt={3} sx={{ border: '1px solid #ccc' }}>
                <Text my={2}>Subscription info</Text>
                <Flex mb={1} justifyContent="space-between">
                  <Text color="#b3b3b3">Program</Text>
                  <Text color="#b3b3b3">{profile?.subscription_info?.current_order?.menu.name}</Text>
                </Flex>
                <Flex mb={1} justifyContent="space-between">
                  <Text color="#b3b3b3">Started</Text>
                  <Text color="#b3b3b3">
                    { profile?.subscription_info?.current_order?.start_date &&
                      format(new Date(profile?.subscription_info?.current_order?.start_date), 'dd LLL, yyyy') } 
                    
                  </Text>
                </Flex>
                <Flex mb={1} justifyContent="space-between">
                  <Text color="#b3b3b3">Ending</Text>
                  <Text color="#b3b3b3">
                  { profile?.subscription_info?.current_order?.end_date &&
                      format(new Date(profile?.subscription_info?.current_order?.end_date), 'dd LLL, yyyy') } 
                  </Text>
                </Flex>
                <Flex mb={1} justifyContent="space-between">
                  <Text color="#b3b3b3">Delivered</Text>
                  <Text color="#b3b3b3">25/30</Text>
                </Flex>
              </Box>
            </Box>
            <Box width={1 / 4} mx={4}>
              <Box p={3} sx={{ border: '1px solid #ccc' }}>
                <Text my={2}>Rewards</Text>
                <Text color="#b3b3b3">Coming soon</Text>
              </Box>
              <Box p={3} mt={3} sx={{ border: '1px solid #ccc' }}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text my={2}>Freeze</Text>
                  <Text my={2} color="primary" onClick={()=> toggleModal()}>Add</Text>
                </Flex>
                <Text mb={1} color="#b3b3b3">
                  Coming soon
                </Text>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default UserProfileBlock;
