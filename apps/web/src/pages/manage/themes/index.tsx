import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Flex, Text } from 'theme-ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import ThemeAddForm from 'components/ThemeForm';
import ThemeList from 'components/ThemeList';
import PageHeader from 'common/PageHeader';
import { Drawer } from 'common/Drawer';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<any>(false);
  return (
    <>
      <Head>
        <title>Themes | Wraft</title>
        <meta name="description" content="wraft themes" />
      </Head>
      <Page>
        <PageHeader
          title="Themes"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Themes' }]}
            />
          }>
          <Button
            as={Button}
            variant="buttonSecondary"
            onClick={() => setIsOpen(true)}>
            <Text variant="pM">Add Theme</Text>
          </Button>
          <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
            {isOpen && (
              <ThemeAddForm setIsOpen={setIsOpen} setRerender={setRerender} />
            )}
          </Drawer>
        </PageHeader>

        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box sx={{ width: '100%' }}>
              <ThemeList rerender={rerender} setRerender={setRerender} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
