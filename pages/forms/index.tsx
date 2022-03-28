import { FC } from 'react';
import Head from 'next/head';
import { Box, Text, Container, Flex } from 'theme-ui';
import FormList from '../../src/components/FormList';
import Page from '../../src/components/PageFrame';
import Link from '../../src/components/NavLink';
import PageHeader from '../../src/components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Forms - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Forms" desc="Collect data via Forms">
          <Box sx={{ ml: 'auto' }}>
            <Link href="/forms/new" variant="btnPrimary">
              + New Form
            </Link>
          </Box>
        </PageHeader>
        <Container variant="layout.pageFrame">
            <FormList/>
        </Container>
      </Page>
    </>
  );
};

export default Index;
