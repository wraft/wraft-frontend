import Image from 'next/image';
import { Flex, Box, Heading, Button, Text } from 'theme-ui';

import Link from 'common/NavLink';

import MailSend from '../../../public/Group 164.svg';

const WaitlistPrompt: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
      <Flex
        variant="onboardingForms"
        sx={{
          alignItems: 'center',
          py: 4,
          px: 5,
          // justifyContent: 'space-between',
        }}>
        <Heading
          as="h3"
          variant="styles.h3Bold"
          sx={{ mt: 4, mb: '8px', color: 'gray.900' }}>
          Hang tight!
        </Heading>
        <Heading
          as="h4"
          sx={{ mb: '28px', textAlign: 'center', color: 'gray.900' }}>
          You have been added to our waitlist
        </Heading>
        <Box mt={'80px'} mb={'70px'}>
          <Image
            src={MailSend}
            alt=""
            className=""
            width={146}
            height={145}
            priority
          />
        </Box>
        <Text sx={{ color: 'gray.900', textAlign: 'center' }}>
          Thanks for showing interest in Wraft, we will reach out to you once
          the availability opens up.
        </Text>
        <Box mt={4} mb={4}>
          <Link href="/">
            <Button>Okay</Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default WaitlistPrompt;
