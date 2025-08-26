import { FC } from 'react';
import Head from 'next/head';
import _dynamic from 'next/dynamic';

import DocumentView from 'components/DocumentView';
import { DocumentProvider } from 'components/DocumentView/DocumentContext';
import Page from 'common/PageFrameInner';

// const DocumentView = dynamic(() => import('components/DocumentView'), {
//   ssr: false,
// });

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Document - Wraft</title>
        <meta
          name="description"
          content="View and interact with documents in Wraft. Access your documents with real-time collaboration and editing capabilities."
        />
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
