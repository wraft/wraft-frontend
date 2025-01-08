import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import TemplateList from 'components/Template/TemplateList';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Templates | Wraft</title>
      </Head>
      <Page>
        <TemplateList />
      </Page>
    </>
  );
};

export default Index;
