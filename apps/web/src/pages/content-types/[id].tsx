import { FC } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import ContentTypeForm from '../../src/components/ContentTypeForm';

import PageFull from '../../components/BlankFrame';
// import CreateForm from '../../src/components/ContentForm';

const CreateForm = dynamic(() => import('../../components/ContentForm'), {
  ssr: false,
});

const Index: FC = () => {
  const router = useRouter();
  // const [action, setAction] = useState<any>();

  // const onSave = () => {
  //   console.log('saved');
  // }

  return (
    <>
      <Head>
        <title>Create Instance - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <PageFull id="Modal" showFull={true}>
        <CreateForm id={router.query.id} />
      </PageFull>
    </>
  );
};

export default Index;
