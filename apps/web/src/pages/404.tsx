import { useRouter } from 'next/router';
import { Text, Button, Flex } from '@wraft/ui';

export default function Custom404() {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      gap="lg">
      <Text fontSize="xl" fontWeight="bold" color="gray.1000">
        404
      </Text>
      <Text fontSize="xl" color="gray.1000">
        Oops! Page not found
      </Text>
      <Text fontSize="md" color="gray.900" textAlign="center" maxWidth="400px">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Text>
      <Button
        variant="secondary"
        onClick={() => router.push('/')}
        // leftIcon={<House size={16} />}
      >
        Back to Home
      </Button>
    </Flex>
  );
}
