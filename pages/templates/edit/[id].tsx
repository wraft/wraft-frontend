import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../../src/components/TemplateForm';
import Page from '../../../src/components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit TemplateForm - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <TemplateForm />
      </Page>
    </>
  );
};

export default Index;
