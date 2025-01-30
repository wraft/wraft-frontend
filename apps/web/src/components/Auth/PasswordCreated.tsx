// import Image from 'next/image';
import Image from 'next/image';
import { Flex, Box, Button, Text } from '@wraft/ui';
import { Link } from 'theme-ui';

import CheckSuccess from '../../../public/check-success.svg';

const PasswordCreated = () => {
  return (
    <Box display="flex" justifyContent="center" mt="80px">
      <Flex alignItems="center" p="0px" pt="78px" px="86px">
        <Text mb="64px">Password Created</Text>
        <Image alt="" src={CheckSuccess} className="" width={32} height={32} />
        <Text my="40px" fontWeight="heading">
          Awesome! You are ready to access your Wraft account Login your account
          and enjoy your workplace
        </Text>
        <Link href="/login">
          <Button>Go to login page</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default PasswordCreated;
