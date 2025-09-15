import { useRouter } from 'next/router';
import { Flex, Button, Box } from '@wraft/ui';
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
      <InternalServerErrorIcon width={320} height={240} />

      <Box p="lg">
        <Button size="lg" variant="primary" onClick={() => router.push('/')}>
          Home
        </Button>
      </Box>
    </Flex>
  );
};

export default ServerErrorPage;
