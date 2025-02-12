import { useRouter } from 'next/router';
import { Box, Flex, Text, Button } from '@wraft/ui';
import { BrandLogoIcon } from '@wraft/icon';

import Link from 'common/NavLink';

interface InviteUnauthorizedBlockProps {
  error: string | null;
}

const InviteUnauthorizedBlock = ({ error }: InviteUnauthorizedBlockProps) => {
  const router = useRouter();

  const homePageUrl = process.env.homePageUrl || '/';

  return (
    <>
      <Flex
        justify="center"
        p="5xl"
        bg="background-secondary"
        h="100vh"
        align="baseline">
        <Box position="absolute" top="80px" left="80px">
          <Link href={homePageUrl}>
            <Box color="gray.0" fill="gray.1200">
              <BrandLogoIcon width="7rem" height="3rem" />
            </Box>
          </Link>
        </Box>

        <Flex
          variant="card"
          w="500px"
          justifySelf="center"
          direction="column"
          textAlign="center">
          {error && (
            <>
              <Text as="h3" mb="md" fontSize="3xl">
                Invite Link Expired
              </Text>
              <Text color="text-secondary">
                The invite URL you used is no longer valid. It may have already
                been used or expired. If you believe this is a mistake, please
                contact support for assistance.
              </Text>
              <Box mt="xxl">
                <Button onClick={() => router.push('/')}>Go Home Page</Button>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default InviteUnauthorizedBlock;
