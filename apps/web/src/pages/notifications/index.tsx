import { FC } from 'react';
import Head from 'next/head';
import { Container } from 'theme-ui';

import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import NotificationList from 'components/NotificationList';

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
