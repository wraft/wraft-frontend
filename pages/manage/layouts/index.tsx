import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container } from 'theme-ui';
import LayoutList from '../../../src/components/LayoutList';
import Page from '../../../src/components/PageFrame';
import ManageSidebar from '../../../src/components/ManageSidebar';
import { HeadingFrame } from '../../../src/components/Card';
import Link from '../../../src/components/NavLink';
import { menuLinks } from '../../../src/utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame
          title="Manage"
          side={
            <Link variant="btnPrimary" href="/manage/layouts/new">
              Add Layout
            </Link>
          }
        />
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={menuLinks}/>
            <LayoutList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
