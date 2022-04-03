import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../src/components/TemplateForm';
import Page from '../../src/components/PageFrameInner';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Template - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>        
        <TemplateForm/>
      </Page>
    </>
  );
};

export default Index;
