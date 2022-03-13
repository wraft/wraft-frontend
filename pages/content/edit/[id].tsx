import { FC } from 'react';
import Head from 'next/head';
// import ContentTypeForm from '../../src/components/ContentTypeForm';


import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Page from '../../../src/components/BlankFrame';

const CreateForm = dynamic(
  () => import('../../../src/components/ContentForm'),
  { ssr: false }
);



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
