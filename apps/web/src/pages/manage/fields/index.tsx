import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import { menuLinks } from '@constants/menuLinks';
import FieldList from 'common/FieldList';
import ManageSidebar from 'common/ManageSidebar';
import NextLinkText from 'common/NavLink';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Fields | Wraft</title>
        <meta name="description" content="wraft fields" />
      </Head>
      <Page>
        <PageHeader title="Fields Types" desc="Manage System Level fields">
          <NextLinkText variant={'secondary'} href="/manage/fields/new">
            + New Field
          </NextLinkText>
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
