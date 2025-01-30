import { FC } from 'react';
import Head from 'next/head';

import DocumentList from 'components/DocumentList';
import Page from 'common/PageFrame';

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
