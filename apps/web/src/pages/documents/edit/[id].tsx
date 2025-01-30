import { FC } from 'react';
import Head from 'next/head';

import { DocumentProvider } from 'components/DocumentView/DocumentContext';
import DocumentView from 'components/DocumentView';
import Page from 'common/PageFrameInner';

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
