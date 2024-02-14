import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import ContentTypeForm from '../../src/components/ContentTypeForm';

// import CreateForm from '../../src/components/ContentForm';

const Index: FC = () => {
  const router = useRouter();
  console.log('router.query', router.query);
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
    </>
  );
};

export default Index;
