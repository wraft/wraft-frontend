import { FC } from 'react';
import Head from 'next/head';
import { Box, Link, Container, Flex, Button } from 'theme-ui';
import ThemeList from '../../components/ThemeList';
import Page from '../../components/PageFrame';
import ManageSidebar from '../../components/ManageSidebar';
import { menuLinks } from '../../utils';
import PageHeader from '../../components/PageHeader';
import { AddIcon, GraterThanIcon } from '../../components/Icons';

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
          <Link href="/themes/new" sx={{ p: '0px' }}>
            <Button
              as={Button}
              variant="btnPrimary"
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AddIcon />
              Add Theme
            </Button>
          </Link>
        </PageHeader>
        <Container
          sx={{
            pt: 0,
            height: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            bg: 'background',
          }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box
              sx={{
                width: '100%',
                bg: 'bgWhite',
                border: '1px solid',
                borderColor: 'neutral.1',
                borderRadius: 4,
                m: 4,
              }}>
              <Box>
                <ThemeList />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
