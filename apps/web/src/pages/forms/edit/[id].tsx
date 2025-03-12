import { FC } from 'react';
import Head from 'next/head';

import Page from 'common/Page';
import FieldTypeForm from 'common/FieldTypeForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Form | Wraft</title>
        <meta name="description" content="edit form" />
      </Head>
      <Page>
        <FieldTypeForm />
      </Page>
    </>
  );
};

export default Index;
