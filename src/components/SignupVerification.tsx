import Image from 'next/image';
import { Flex, Box, Heading, Button } from 'theme-ui';
import MailSend from '../../public/Group 164.svg';

const SignupVerification = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
      <Flex
        variant="onboardingForms"
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          pt: '109px',
        }}>
        <Image
          src={MailSend}
          alt=""
          width={146}
          height={145}
          className=""
          priority
        />
        <Heading as="h1" variant="styles.h1" sx={{ mt: '90px', mb: '8px' }}>
          Great!
        </Heading>
        <Heading
          as="h5"
          variant="styles.h5"
          sx={{ maxWidth: '376px', mb: '32px', textAlign: 'center' }}>
          We have sent a verification link to the registered email
        </Heading>
        <Button>Okay</Button>
      </Flex>
    </Box>
  );
};

export default SignupVerification;
