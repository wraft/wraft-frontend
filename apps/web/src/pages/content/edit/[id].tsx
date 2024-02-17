import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// import ContentTypeForm from '../../src/components/ContentTypeForm';

import Page from 'components/PageFrameInner';
import { ContentForm } from 'components/Document';

const Index: FC = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Doc - Wraft Docs</title>
      </Head>
      <Page id="Modal" showFull={false}>
        <ContentForm id={router.query.id} edit={true} />
      </Page>
    </>
  );
};

export default Index;
