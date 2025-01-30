import { FC } from 'react';
import Head from 'next/head';

import { ImporterWrapper } from 'components/ImportTemplate';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Import | Wraft </title>
        <meta name="description" content="Import Document structures" />
      </Head>
      <Page>
        <PageHeader title="Import" desc="Import Document Structures" />
        <ImporterWrapper />
      </Page>
    </>
  );
};

export default Contents;
