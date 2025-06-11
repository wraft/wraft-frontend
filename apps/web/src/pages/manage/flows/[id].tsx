import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Flex } from '@wraft/ui';
import { DotsThreeVertical } from '@phosphor-icons/react';

// import { menuLinks } from '@constants/menuLinks';
import FlowViewForm from 'components/Flow/FlowViewForm';
// import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
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
          }>
          <Button
            variant="secondary"
            size="sm"
            // px="sm"
            // py="xs"
            // onClick={() => setIsOpen(true)}
          >
            <DotsThreeVertical weight="bold" color="gray.700" />
          </Button>
        </PageHeader>

        <Flex gap="md" my="md" px="md">
          <FlowViewForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
