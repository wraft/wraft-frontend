import { FC } from 'react';
import Head from 'next/head';
import { Box, Text, Container, Flex } from 'theme-ui';
import ThemeList from '../../src/components/ThemeList';
import Page from '../../src/components/PageFrame';
import Link from '../../src/components/NavLink';
import ManageSidebar from '../../src/components/ManageSidebar';
import { menuLinks } from '../../src/utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Themes - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Container variant="layout.pageFrame">
          <Box sx={{ py: 4, borderBottom: 'solid 1px #ddd' }}>
            <Text variant="text.pageTitle">Manage</Text>
          </Box>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ ml: 'auto' }}>
                  <Link variant="button" href="/themes/new">
                    <a>Add Theme</a>
                  </Link>
                </Box>
              </Box>
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
