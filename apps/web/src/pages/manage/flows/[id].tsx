import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import FlowViewForm from 'components/Flow/FlowViewForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [flow, setFlow] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`flows/${id}`).then((data: any) => {
      setFlow(data);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Edit Flow | Wraft</title>
      </Head>
      <Page>
        <PageHeader
          title={[
            {
              name: 'Manage',
              path: '/manage',
            },
            {
              name: 'Flows',
              path: '/manage/flows',
            },
            { name: `${flow?.flow?.name}`, path: '.' },
          ]}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Flows', path: '/manage/flows' },
                { name: `${flow?.flow?.name || ''}` },
              ]}
            />
          }></PageHeader>

        <PageInner>
          <FlowViewForm />
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
