import { FC } from 'react';
import Head from 'next/head';

import { ContentForm } from 'components/Document';
import PageFull from 'components/BlankFrame';

// const CreateForm = dynamic(() => import('../components/ContentForm'), {
//   ssr: false,
// });

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Document - Wraft Docs</title>
        <meta name="description" content="Create a New Document with Wraft" />
      </Head>
      <PageFull id="Modal" showFull={true}>
        <ContentForm />
      </PageFull>
    </>
  );
};

export default Index;
