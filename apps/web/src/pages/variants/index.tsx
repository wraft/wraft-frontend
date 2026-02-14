import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import VariantList from 'components/Variants/VariantList';
import Page from 'common/PageFrame';
import { Button } from '@wraft/ui';
import { Plus } from '@phosphor-icons/react';

const Index: FC = () => {
  const router = useRouter();

  const handleNewVariant = () => {
    router.push('/variants/new');
  };

  return (
    <>
      <Head>
        <title>Variants | Wraft</title>
        <meta name="description" content="Wraft variants" />
      </Head>
      <Page>
        <Button onClick={handleNewVariant} variant="secondary" size="sm">
          <Plus size={12} weight="bold" />
          New Variant
        </Button>
        <VariantList />
      </Page>
    </>
  );
};

export default Index;
