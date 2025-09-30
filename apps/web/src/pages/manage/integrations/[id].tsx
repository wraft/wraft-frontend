import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { IntegrationDetail } from 'components/Integration/IntegrationDetail';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';

const IntegrationDetailPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Integration Details | Wraft</title>
        <meta name="description" content="Configure your integration" />
      </Head>
      <Page>
        <PageHeader
          title={[
            {
              name: 'Manage',
              path: '/manage',
            },
            {
              name: 'Integrations',
              path: '/manage/integrations',
            },
            {
              name: 'Details',
              path: `/manage/integrations/${id}`,
            },
          ]}
          desc="Configure and manage your integration settings"
        />
        <PageInner>
          <IntegrationDetail integrationId={id} />
        </PageInner>
      </Page>
    </>
  );
};

export default IntegrationDetailPage;
