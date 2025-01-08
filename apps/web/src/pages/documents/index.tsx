import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrame';
import DocumentList from 'components/DocumentList';

const Documents: FC = () => {
  return (
    <>
      <Head>
        <title>Documents | Wraft </title>
        <meta name="description" content="wraft documents" />
      </Head>
      <Page>
        <DocumentList />
      </Page>
    </>
  );
};

export default Documents;
