import { FC } from 'react';
import Head from 'next/head';

import NotificationList from 'components/Notification/NotificationList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';

const Notification: FC = () => {
  return (
    <>
      <Head>
        <title>Notification - Wraft Docs</title>
        <meta name="description" content="Manage Notification" />
      </Head>
      <Page>
        <PageHeader
          title="Notification"
          desc={
            <DescriptionLinker
              data={[
                { name: 'User', path: '' },
                { name: 'Notification', path: '' },
              ]}
            />
          }
        />

        <NotificationList />
      </Page>
    </>
  );
};

export default Notification;
