import { FC } from 'react';
import Head from 'next/head';

import TemplateForm from 'components/Template/TemplateForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Template | Wraft</title>
        <meta name="description" content="wraft template" />
      </Head>
      <TemplateForm />
    </>
  );
};

export default Index;
