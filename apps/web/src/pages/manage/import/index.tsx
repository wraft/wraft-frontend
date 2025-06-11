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
        <meta name="description" content="Import Document Variants" />
      </Head>
      <Page>
        <PageHeader
          title={[
            {
              name: 'Manage',
              path: '/manage',
            },
            {
              name: 'Import',
              path: 'import',
            },
          ]}
          desc="Import Document Variants"
        />
        <ImporterWrapper />
      </Page>
    </>
  );
};

export default Contents;
