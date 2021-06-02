import { FC } from 'react';
import Head from 'next/head';
// import ContentTypeForm from '../../src/components/ContentTypeForm';

import Page from '../../../src/components/BlankFrame';
import { useRouter } from 'next/router';
import CreateForm from '../../../src/components/ContentForm';

const Index: FC = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Doc - Wraft Docs</title>
      </Head>
      <Page id="Modal" showFull={true}>
        <CreateForm id={router.query.id} edit={true} />
      </Page>
    </>
  );
};

export default Index;
