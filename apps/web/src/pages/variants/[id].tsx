import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container } from 'theme-ui';

import Page from 'components/PageFrame';
import VariantViewForm from 'components/Variants/VariantViewForm';
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
        <Container variant="layout.pageFrame">
          <VariantViewForm />
        </Container>
      </Page>
    </>
  );
};

export default Index;
