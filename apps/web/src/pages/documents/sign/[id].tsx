import { FC } from 'react';
import Head from 'next/head';

import DocumentView from 'components/DocumentView';
import { DocumentProvider } from 'components/DocumentView/DocumentContext';
import Page from 'common/PageFrameInner';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Document - Wraft</title>
        <meta name="description" content="Sign your document in Wraft." />
      </Head>
      <Page>
        <DocumentProvider mode="view">
          <DocumentView />
        </DocumentProvider>
      </Page>
    </>
  );
};

export default Index;
