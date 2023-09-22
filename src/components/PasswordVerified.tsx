// import Image from 'next/image';
import { Flex, Box, Heading, Button, Link } from 'theme-ui';
import CheckSuccess from '../../public/check-success.svg';

const PasswordVerified = () => {
  return (
    <Box as="main" sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
      <Flex
        as="section"
        variant="signinRight"
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          pt: '170px',
        }}>
        <img src={CheckSuccess} alt="" className="" />
        <Heading
          as="h3"
          variant="styles.h3"
          sx={{ mt: '127px', mb: '32px', color: '#363E49' }}>
          Password changed
        </Heading>
        <Link href="/">
          <Button>Go to login page</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default PasswordVerified;
