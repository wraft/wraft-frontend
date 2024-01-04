import { FC } from 'react';

import Head from 'next/head';
import { Box, Container } from 'theme-ui';

import FormList from '../../components/FormList';
import Link from '../../components/NavLink';
import Page from '../../components/PageFrame';
import PageHeader from '../../components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Forms - Wraft Docs</title>
        <meta name="description" content="Manage Forms" />
      </Head>
      <Page>
        <PageHeader title="Forms" desc="Collect data via Forms">
          <Box sx={{ ml: 'auto', pt: 2 }}>
            <Link href="/forms/new" variant="btnSmall">
              New Form
            </Link>
          </Box>
        </PageHeader>
        <Container variant="layout.pageFrame">
          <FormList />
        </Container>
      </Page>
    </>
  );
};

export default Index;
