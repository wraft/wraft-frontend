import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import TemplateForm from 'components/Template/TemplateForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Template | Wraft</title>
      </Head>
      <Page>
        <TemplateForm />
      </Page>
    </>
  );
};

export default Index;
