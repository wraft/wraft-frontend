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
      <InternalServerErrorIcon width={260} height={160} />
      <Text as="span" fontSize="2xl">
        500
      </Text>
      <Text as="span" fontWeight="bold" color="" fontSize="2xl" mt="sm">
        Internal Server Error
      </Text>
      <Text fontSize="md" color="text-secondary" py="sm">
        Oops! Something went wrong
      </Text>
      <Box p="lg">
        <Button size="md" variant="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </Box>
    </Flex>
  );
};

export default ServerErrorPage;
