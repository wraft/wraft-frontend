import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../../src/components/TemplateForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit TemplateForm - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <TemplateForm />
    </>
  );
};

export default Index;
