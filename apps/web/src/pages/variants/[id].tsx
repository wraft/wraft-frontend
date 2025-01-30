import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import VariantDetailForm from 'components/Variants/VariantDetailForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [variant, setVariant] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      setVariant(data);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Variant | Wraft</title>
        <meta name="description" content="edit variant" />
      </Head>
      <Page>
        <PageHeader
          title={variant?.content_type?.name || ''}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Variants', path: '/variants' },
                { name: `${variant?.content_type?.name || ''}` },
              ]}
            />
          }
        />

        <VariantDetailForm />
      </Page>
    </>
  );
};

export default Index;
