import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import TemplateList from 'components/TemplateList';

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
