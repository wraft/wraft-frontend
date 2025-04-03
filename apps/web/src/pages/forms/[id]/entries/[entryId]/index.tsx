import { FC } from 'react';
import Head from 'next/head';

import FormEntryDetails from 'components/Form/FormEntryDetails';
import Page from 'common/PageFrame';
import { authorizeRoute } from 'middleware/authorize';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Form Response Details | Wraft</title>
        <meta name="description" content="form response details" />
      </Head>
      <Page>
        <FormEntryDetails />
      </Page>
    </>
  );
};

const BlockEditPage = authorizeRoute(Index, 'form_entry', 'manage');
export default BlockEditPage;
