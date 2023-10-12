// import Image from 'next/image';
import { Flex, Box, Heading, Button, Link } from 'theme-ui';
import CheckSuccess from '../../public/check-success.svg';

const PasswordVerified = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
      <Flex
        variant="onboardingForms"
        sx={{
          alignItems: 'center',
          p: '0px',
          pt: '170px',
          px: '228px',
        }}>
        <img src={CheckSuccess} alt="" className="" />
        <Heading
          as="h3"
          variant="styles.h3Medium"
          sx={{ mt: '127px', mb: '32px', color: '#363E49' }}>
          Password changed
        </Heading>
        <Link href="/login">
          <Button>Go to login page</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default PasswordVerified;
