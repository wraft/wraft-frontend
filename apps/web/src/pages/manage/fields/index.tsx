import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import FieldList from '../../../components/FieldList';
import ManageSidebar from '../../../components/ManageSidebar';
import Link from '../../../components/NavLink';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Fields | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Fields Types" desc="Manage System Level fields">
          <Box sx={{ ml: 'auto', mr: 0, mt: 2 }}>
            <Link href="/manage/fields/new" variant="btnSecondary">
              + New Field
            </Link>
          </Box>
        </PageHeader>
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <FieldList />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
