import { FC } from 'react';
import Head from 'next/head';

import FieldTypeForm from 'common/FieldTypeForm';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout | Wraft</title>
        <meta
          name="description"
          content="Customize fields and forms for your documents."
        />
      </Head>
      <Page>
        <FieldTypeForm />
      </Page>
    </>
  );
};

export default Index;
