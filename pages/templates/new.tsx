import { FC } from 'react';
import Head from 'next/head';
import TemplateForm from '../../src/components/TemplateForm';

import Page from '../../src/components/PageFrame';
// import { Flex } from 'theme-ui';
// import Link from 'next/link';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Template - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        x
        <TemplateForm/>
      </Page>
    </>
  );
};

export default Index;
