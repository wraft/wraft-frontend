import { FC } from 'react';
import Head from 'next/head';

import TemplateList from '../../components/TemplateList';
import Page from '../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Templates - Wraft Docs</title>
      </Head>
      <Page>
        <TemplateList />
      </Page>
    </>
  );
};

export default Index;
