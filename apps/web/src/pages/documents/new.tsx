import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import { DocumentProvider } from 'components/DocumentView/DocumentContext';
import DocumentView from 'components/DocumentView';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Document - Wraft</title>
        <meta name="description" content="Create a New Document with Wraft" />
      </Head>
      <Page>
        <DocumentProvider mode="new">
          <DocumentView />
        </DocumentProvider>
      </Page>
    </>
  );
};

export default Index;
