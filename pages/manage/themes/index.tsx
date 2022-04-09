import { FC } from 'react';
import Head from 'next/head';
import { Container, Flex } from 'theme-ui';
import ThemeList from '../../../src/components/ThemeList';
import Page from '../../../src/components/PageFrame';
import Link from '../../../src/components/NavLink';
import ManageSidebar from '../../../src/components/ManageSidebar';
import { HeadingFrame } from '../../../src/components/Card';
import { menuLinks } from '../../../src/utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame
          title="Manage"
          side={
            <Link variant="btnPrimary" href="/manage/themes/new">
              Add Theme
            </Link>
          }
        />
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <ThemeList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
