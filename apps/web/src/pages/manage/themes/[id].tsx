import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex } from '@wraft/ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import ThemeViewForm from 'components/Theme/ThemeViewForm';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [theme, setTheme] = useState<any>();
  const router = useRouter();
  const id: string = router.query.id as string;

  useEffect(() => {
    fetchAPI(`themes/${id}`).then((data: any) => {
      setTheme(data);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Edit Theme | Wraft</title>
        <meta name="description" content="edit theme" />
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

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={menuLinks} />
          <ThemeViewForm />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
