import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import DocumentView from 'components/DocumentView';
import { DocumentProvider } from 'components/DocumentView/DocumentContext';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Document - Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
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
