import { FC } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import PageFull from '../components/BlankFrame';

const CreateForm = dynamic(() => import('../components/ContentForm'), {
  ssr: false,
});

const Index: FC = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('template');

  return (
    <>
      <Head>
        <title>New Document - Wraft Docs</title>
        <meta name="description" content="Create a New Document with Wraft" />
      </Head>
      <PageFull id="Modal" showFull={true}>
        <CreateForm id={search} />
      </PageFull>
    </>
  );
};

export default Index;
