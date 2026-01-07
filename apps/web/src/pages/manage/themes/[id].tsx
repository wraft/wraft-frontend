import { FC, useState } from 'react';
import Head from 'next/head';

import ThemeViewForm from 'components/Theme/ThemeViewForm';
import DescriptionLinker from 'common/DescriptionLinker';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';

const Index: FC = () => {
  const [theme, setTheme] = useState<any>();

  const handleThemeLoad = (themeData: any) => {
    setTheme(themeData);
  };
  return (
    <>
      <Head>
        <title>
          {theme?.theme?.name
            ? ` ${theme.theme.name} | Wraft`
            : 'Theme Details | Wraft'}
        </title>
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Themes', path: '/manage/themes' },
            { name: `${theme?.theme?.name}`, path: '.' },
          ]}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Themes', path: '/manage/themes' },
                { name: `${theme?.theme?.name}` },
              ]}
            />
          }
        />
        <PageInner>
          <ThemeViewForm onThemeLoad={handleThemeLoad} />
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
