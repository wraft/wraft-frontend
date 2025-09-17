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
      <NotFoundIcon width={260} height={160} />
      <Text as="span" fontSize="2xl">
        404
      </Text>
      <Text as="span" fontWeight="bold" color="" fontSize="2xl" mt="sm">
        Page not found
      </Text>
      <Text fontSize="md" color="text-secondary" py="sm">
        The Page you are looking for was not found.
      </Text>

      <Box p="lg">
        <Button size="md" variant="primary" onClick={handleGoHome}>
          Back to Home
        </Button>
      </Box>
    </Flex>
  );
};

export default NotFoundPage;
