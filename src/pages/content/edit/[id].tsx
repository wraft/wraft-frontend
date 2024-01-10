import { FC } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

// import ContentTypeForm from '../../src/components/ContentTypeForm';

import Page from '../../../components/PageFrameInner';

const CreateForm = dynamic(() => import('../../../components/ContentForm'), {
  ssr: false,
});

const Index: FC = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Doc - Wraft Docs</title>
      </Head>
      <Page id="Modal" showFull={false}>
        <CreateForm id={router.query.id} edit={true} />
      </Page>
    </>
  );
};

export default Index;
