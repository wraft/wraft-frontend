import Image from 'next/image';
import { Button, Flex, Box, Text } from '@wraft/ui';

import Link from 'common/NavLink';

import MailSend from '../../../public/Group 164.svg';

const WaitlistPrompt: React.FC = () => {
  return (
    <Flex
      justify="center"
      my="5xl"
      py="5xl"
      px="4xl"
      direction="column"
      w="500px"
      justifySelf="center"
      border="1px solid"
      borderColor="border"
      alignItems="center">
      <Text fontWeight="heading" fontSize="3xl" mb="sm">
        Hang tight!
      </Text>
      <Text mb="sm" color="text-secondary">
        You have been added to our waitlist
      </Text>
      <Box>
        <Image
          src={MailSend}
          alt=""
          className=""
          width={146}
          height={145}
          priority
        />
      </Box>
      <Text textAlign="center" mt="md" color="text-secondary">
        Thanks for showing interest in Wraft, we will reach out to you once the
        availability opens up.
      </Text>
      <Box mt={4} mb={4}>
        <Link href="/">
          <Button>Okay</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default WaitlistPrompt;
