import { FC } from 'react';

import Head from 'next/head';

import FieldList from '../../../components/FieldList';
import Page from '../../../components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Fields | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <FieldList />
      </Page>
    </>
  );
};

export default Index;
