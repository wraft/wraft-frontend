import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex } from '@wraft/ui';

import { menuLinks } from '@constants/menuLinks';
import ThemeViewForm from 'components/Theme/ThemeViewForm';
import DescriptionLinker from 'common/DescriptionLinker';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
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
