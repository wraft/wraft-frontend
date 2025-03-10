import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';

import NotificationList from 'components/Notification/NotificationList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const Notification: FC = () => {
  return (
    <>
      <Head>
        <title>Notification - Wraft Docs</title>
        <meta name="description" content="Manage Notification" />
      </Head>
      <Page>
        <PageHeader title="Notification" />
        <Container variant="layout.pageFrame">
          <NotificationList />
        </Container>
      </Page>
    </>
  );
};

export default Notification;
