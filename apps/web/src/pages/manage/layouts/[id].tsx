import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import LayoutViewForm from 'components/Layout/LayoutViewForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [layout, setLayout] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`layouts/${id}`).then((data: any) => {
      setLayout(data);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Edit Layout | Wraft</title>
        <meta name="description" content="edit layout" />
      </Head>
      <Page>
        <PageHeader
          title="Layout"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Layouts', path: '/manage/layouts' },
                { name: `${layout?.layout?.name || ''}` },
              ]}
            />
          }
        />

        <LayoutViewForm cId={id} />
      </Page>
    </>
  );
};

export default Index;
