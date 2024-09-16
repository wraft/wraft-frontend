import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Flex } from 'theme-ui';

import FlowViewForm from 'components/FlowViewForm';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
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
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowViewForm />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
