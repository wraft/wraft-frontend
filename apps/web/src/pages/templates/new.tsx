import { FC } from 'react';
import Head from 'next/head';

import TemplateForm from 'components/Template/TemplateForm';
import Page from 'common/PageFrameInner';

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
