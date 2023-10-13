import { FC } from 'react';
import Head from 'next/head';
import { Container, Flex } from 'theme-ui';
import ThemeList from '../../../components/ThemeList';
import Page from '../../../components/PageFrame';
import Link from '../../../components/NavLink';
// import ManageSidebar from '../../../components/ManageSidebar';
import { HeadingFrame } from '../../../components/Card';
// import { menuLinks } from '../../../utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame
          title="Manage > Themes"
          side={
            <Link variant="btnSecondary" href="/manage/themes/new">
              Add Theme
            </Link>
          }
        />
        <Container variant="layout.pageFrame">
          <Flex>
            {/* <ManageSidebar items={menuLinks} /> */}
            <ThemeList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
