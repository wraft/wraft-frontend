import Image from 'next/image';
import { Flex, Button, Text } from '@wraft/ui';
import { Link } from 'theme-ui';

import CheckSuccess from '../../../public/check-success.svg';

const PasswordCreated = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      mt="80px"
      alignItems="center">
      <Text as="h2" fontSize="3xl" mb="md">
        Password Created
      </Text>

      <Image alt="" src={CheckSuccess} className="" width={32} height={32} />
      <Text py="md" fontWeight="heading">
        Awesome! You are ready to access your Wraft account Login your account
        and enjoy your workplace
      </Text>

      <Link href="/login">
        <Button>Go to login page</Button>
      </Link>
    </Flex>
  );
};

export default PasswordCreated;
