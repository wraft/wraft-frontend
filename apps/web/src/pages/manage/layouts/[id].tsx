import { FC, useEffect, useState } from 'react';

import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Flex } from 'theme-ui';

import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { menuLinks } from '../../../utils';
import { fetchAPI } from '../../../utils/models';

const Index: FC = () => {
  const [layout, setLayout] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`layouts/${id}`).then((data: any) => {
      console.log(data);
      setLayout(data);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Edit Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader
          title="Themes"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Layout', path: '/manage/layouts' },
                { name: `${layout?.layout?.name || ''}` },
              ]}
            />
          }
        />
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <Box p={4}>{/* <ThemeViewForm /> */}</Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
