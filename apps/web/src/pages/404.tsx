import { useRouter } from 'next/router';
import { Flex, Button, Box, Text } from '@wraft/ui';
import { NotFoundIcon } from '@wraft/icon';

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="background-primary">
      <NotFoundIcon width={300} height={240} />
      <Flex
        color="gray.1000"
        py="sm"
        display="flex"
        alignItems="center"
        spaceX="xs">
        <Text as="span" fontWeight="bold" fontSize="3xl">
          404
        </Text>
        <Text as="span" color="gray.900" fontSize="xl">
          Page not found
        </Text>
      </Flex>
      <Text fontSize="md" color="gray.900" py="sm">
        The Page You&apos;re Looking For Isn&apos;t Here.
      </Text>
      <Text fontSize="md" color="gray.900">
        Let&apos;s Get You Back Home
      </Text>

      <Box p="lg">
        <Button size="md" variant="primary" onClick={handleGoHome}>
          Home
        </Button>
      </Box>
    </Flex>
  );
};

export default NotFoundPage;
