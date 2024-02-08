import { FC } from 'react';

import Head from 'next/head';
import Router from 'next/router';
import { Box, Button, Container, Flex, Text } from 'theme-ui';

import { GraterThanIcon } from '../../../components/Icons';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ThemeList from '../../../components/ThemeList';
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
            <Flex sx={{ alignItems: 'center', gap: '6px', color: 'gray.400' }}>
              Manage <GraterThanIcon /> Themes
            </Flex>
          }>
          <Button
            as={Button}
            variant="buttonSecondary"
            onClick={() => Router.push('themes/new')}>
            <Text variant="pM">Add Theme</Text>
          </Button>
        </PageHeader>

        <Container variant="layout.pageFrame">
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
