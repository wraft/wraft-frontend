import { FC } from 'react';
import Head from 'next/head';

import { IntegrationList } from 'components/Integration/IntegrationList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';

const IntegrationsPage: FC = () => {
  return (
    <>
      <Head>
        <title>Integrations | Wraft</title>
        <meta name="description" content="Manage integrations" />
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
          ]}
          desc="Connect and manage your integrations"
        />
        <PageInner>
          <IntegrationList />
        </PageInner>
      </Page>
    </>
  );
};

export default IntegrationsPage;
