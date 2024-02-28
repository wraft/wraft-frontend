import { FC } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Box, Container, Flex } from 'theme-ui';
import { Button } from '@wraft/ui';

import FieldList from 'components/FieldList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Fields | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Fields Types" desc="Manage System Level fields">
          <Button
            variant="secondary"
            onClick={() => Router.push('/manage/fields/new')}>
            + New Field
          </Button>
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
