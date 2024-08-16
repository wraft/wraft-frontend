import { FC } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import FieldList from 'components/FieldList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import NextLinkText from 'components/NavLink';
import { menuLinks } from 'utils/index';

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
