import { FC } from 'react';
import Head from 'next/head';
import { Plus } from '@phosphor-icons/react';

import Page from 'common/PageFrameInner';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Variant | Wraft</title>
        <meta name="description" content="Create a new variant" />
      </Head>
      <Page>
        {/* Placeholder for wizard component */}
        <Box width="100%" height="calc(100vh - 100px)" display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="md">
          <Text fontSize="xl" fontWeight="heading">
            New Variant Creation
          </Text>
          <Text color="text-secondary">
            Create content type variants with step-by-step guidance
          </Text>
          <Text color="text-tertiary" fontSize="sm">
            Coming soon: Full wizard with sidebar
          </Text>
        </Box>
      </Page>
    </>
  );
};

export default Index;
