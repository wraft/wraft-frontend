import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import { Box, Container, Flex } from 'theme-ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import ThemeViewForm from 'components/ThemeViewForm';
import { menuLinks } from 'utils/index';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [theme, setTheme] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`themes/${id}`).then((data: any) => {
      console.log(data);
      setTheme(data);
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
                { name: 'Themes', path: '/manage/themes' },
                { name: `${theme?.theme?.name || ''}` },
              ]}
            />
          }
        />
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <Box p={4}>
                <ThemeViewForm />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
