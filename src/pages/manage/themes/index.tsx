import { FC } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Flex } from 'theme-ui';
import ThemeList from '../../../components/ThemeList';
import Page from '../../../components/PageFrame';
import Link from '../../../components/NavLink';
import PageHeader from '../../../components/PageHeader';
import { AddIcon, GraterThanIcon } from '../../../components/Icons';
import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader
          title="Themes"
          desc={
            <Flex sx={{ alignItems: 'center', gap: '6px', color: 'gray.3' }}>
              Manage <GraterThanIcon /> Themes
            </Flex>
          }>
          <Link href="themes/new" variant="none">
            <Button
              as={Button}
              variant="btnPrimary"
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AddIcon />
              Add Theme
            </Button>
          </Link>
        </PageHeader>
        <Container variant="layout.newPageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <ThemeList />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
