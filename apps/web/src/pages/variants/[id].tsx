import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Flex, Spinner } from '@wraft/ui';

import VariantDetailForm from 'components/Variants/VariantDetailForm';
import Page from 'common/PageFrameInner';
import PageHeader from 'common/PageHeader';

const Index: FC = () => {
  const router = useRouter();
  const id: string = router.query.id as string;

  if (!id) {
    return (
      <Page>
        <Flex align="center" justify="center" py="3xl">
          <Spinner size={24} />
        </Flex>
      </Page>
    );
  }

  return (
    <>
      <Head>
        <title>Variants | Wraft</title>
        <meta name="description" content="Variant details" />
      </Head>
      <Page>
        <PageHeader
          title={[{ name: 'Variants', path: '/variants' }]}
          desc="Variant configuration and field details"
        />
        <Box px="xxl" py="lg">
          <VariantDetailForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
