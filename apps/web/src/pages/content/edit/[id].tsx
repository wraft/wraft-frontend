import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import { DocumentProvider } from 'components/DocumentView/DocumentContext';
import DocumentView from 'components/DocumentView';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Doc - Wraft</title>
      </Head>
      <Page>
        <DocumentProvider mode="edit">
          <DocumentView />
        </DocumentProvider>
      </Page>
    </>
  );
};

export default Index;
