import { FC, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import Head from 'next/head';
import { Box, Button, Container, Flex, Text } from 'theme-ui';

import { GraterThanIcon } from '../../../components/Icons';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ThemeAddForm from '../../../components/ThemeAddForm';
import ThemeList from '../../../components/ThemeList';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
            onClick={() => setIsOpen(true)}>
            <Text variant="pM">Add Theme</Text>
          </Button>
          <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
            {isOpen && <ThemeAddForm />}
          </Drawer>
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
