import { FC } from 'react';
import Head from 'next/head';

import TemplateList from 'components/Template/TemplateList';
import Page from 'common/PageFrame';

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
