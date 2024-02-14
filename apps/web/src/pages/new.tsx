import { FC } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import PageFull from '../components/BlankFrame';

const CreateForm = dynamic(() => import('../components/ContentForm'), {
  ssr: false,
});

const Index: FC = () => {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const contentTypeId = searchParams.get('cid');

  return (
    <>
      <Head>
        <title>New Document - Wraft Docs</title>
        <meta name="description" content="Create a New Document with Wraft" />
      </Head>
      <PageFull id="Modal" showFull={true}>
        <CreateForm tid={templateId} cid={contentTypeId} />
      </PageFull>
    </>
  );
};

export default Index;
