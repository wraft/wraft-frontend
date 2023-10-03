import Image from 'next/image';
import { Flex, Box, Heading, Button, Link } from 'theme-ui';
import Verified from '../../public/Social 01 1.svg';

const EmailVerified = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
      <Flex
        variant="onboardingForms"
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          pt: '103px',
        }}>
        <Image
          src={Verified}
          alt=""
          width={224}
          height={224}
          className=""
          priority
        />
        <Heading
          as="h3"
          variant="styles.h3"
          sx={{ mt: '88px', mb: '32px', color: '#363E49' }}>
          Your email is verified
        </Heading>

        <Link href="/">
          <Button>Go to login page</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default EmailVerified;
