import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container } from 'theme-ui';
import LayoutList from '../../../components/LayoutList';
import Page from '../../../components/PageFrame';
import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';
import PageHeader from '../../../components/PageHeader';
import NavLink from '../../../components/NavLink';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <NavLink variant="btnSecondary" href="/manage/layouts/new">
            Add Layout
          </NavLink>
        </PageHeader>
        {/* <HeadingFrame
          title="Manage"
          side={
            <Link variant="btnSecondary" href="/manage/layouts/new">
              Add Layout
            </Link>
          }
        /> */}
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <LayoutList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
