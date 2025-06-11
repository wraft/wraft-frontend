import { FC } from 'react';
import Head from 'next/head';

import Billing from 'components/Billing';
import { Page } from 'common/PageFrame';
import DescriptionLinker from 'common/DescriptionLinker';
import PageHeader from 'common/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Plans | Wraft</title>
        <meta name="description" content="wraft blocks" />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Billing & Subscription', path: '/manage/billing' },
          ]}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Billing & Subscription', path: '/manage/billing' },
              ]}
            />
          }
        />
        <Billing />
      </Page>
    </>
  );
};

export default Index;
