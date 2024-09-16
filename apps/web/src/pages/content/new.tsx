import { FC } from 'react';
import Head from 'next/head';

import { ContentForm } from 'components/Document';
import Page from 'components/PageFrameInner';

// const CreateForm = dynamic(() => import('components/ContentForm'), {
//   ssr: false,
// });

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Document - Wraft</title>
        <meta name="description" content="Create a New Document with Wraft" />
      </Head>
      <Page>
        <ContentForm />
      </Page>
    </>
  );
};

export default Index;
