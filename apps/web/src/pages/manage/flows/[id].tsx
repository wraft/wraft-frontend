import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex } from '@wraft/ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import FlowViewForm from 'components/Flow/FlowViewForm';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils';
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
          title="Flows"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Flows', path: '/manage/flows' },
                { name: `${flow?.flow?.name || ''}` },
              ]}
            />
          }></PageHeader>

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <FlowViewForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
