import Image from 'next/image';
import { Flex, Box, Heading, Button, Text } from 'theme-ui';

import MailSend from '../../public/Group 164.svg';

import Link from './NavLink';

const WaitlistPrompt: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
      <Flex
        variant="onboardingForms"
        sx={{
          alignItems: 'center',
          p: '0px',
          pt: '109px',
          px: '98px',
        }}>
        <Image
          src={MailSend}
          alt=""
          className=""
          width={146}
          height={145}
          priority
        />
        <Heading
          as="h1"
          variant="styles.h1Medium"
          sx={{ mt: '40px', mb: '8px', color: 'gray.600' }}>
          Hang tight!
        </Heading>
        <Heading
          as="h5"
          variant="styles.h5Bold"
          sx={{ mb: '28px', textAlign: 'center', color: 'gray.500' }}>
          You have been added to our waitlist
        </Heading>
        <Text
          variant="styles.h5Medium"
          sx={{ color: 'gray.300', textAlign: 'center', mb: '24px' }}>
          Thanks for showing interest in Wraft, we will reach out to you once
          the availability opens up.
        </Text>
        <Link href="/">
          <Button>Okay</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default WaitlistPrompt;
