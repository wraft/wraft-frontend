import { useRouter } from 'next/router';
import { Flex, Button, Box, Text } from '@wraft/ui';
import { InternalServerErrorIcon } from '@wraft/icon';

const ServerErrorPage = () => {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p="lg"
      bg="background-primary">
      <InternalServerErrorIcon width={300} height={200} />
      <Flex py="sm" display="flex" alignItems="center" spaceX="xs">
        <Text as="span" fontWeight="bold" fontSize="3xl">
          500
        </Text>
        <Text as="span" color="gray.900" fontSize="xl">
          Internal Server Error
        </Text>
      </Flex>
      <Text fontSize="md" color="gray.1000" py="sm">
        Oops! Something went wrong
      </Text>
      <Text fontSize="md" color="gray.900" textAlign="center" maxWidth="400px">
        We&apos;re very sorry, however something went wrong when trying to load
        this page. Please try again or
        <Text
          ml="xs"
          as="a"
          href="mailto:hello@functionary.co"
          color="blue.500"
          textDecoration="underline"
          display="inline">
          contact us
        </Text>
      </Text>
      <Box p="lg">
        <Button size="md" variant="primary" onClick={() => router.push('/')}>
          Home
        </Button>
      </Box>
    </Flex>
  );
};

export default ServerErrorPage;
