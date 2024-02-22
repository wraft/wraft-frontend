import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import TemplateForm from 'components/TemplateForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Template | Wraft Docs</title>
      </Head>
      <Page>
        <TemplateForm />
      </Page>
    </>
  );
};

export default Index;
