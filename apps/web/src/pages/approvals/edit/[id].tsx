import { FC } from 'react';
import Head from 'next/head';

import Page from 'common/PageFrame';
import FieldTypeForm from 'common/FieldTypeForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Approvals | Wraft</title>
        <meta name="description" content="edit documents in approval" />
      </Head>
      <Page>
        <FieldTypeForm />
      </Page>
    </>
  );
};

export default Index;
