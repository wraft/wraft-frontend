import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Flex, Container, Box } from 'theme-ui';
import { Button } from '@wraft/ui';

import LayoutForm from 'components/LayoutForm';
import LayoutList from 'components/LayoutList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'common/PageHeader';
import { Drawer } from 'common/Drawer';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft</title>
        <meta name="description" content="wraft layouts" />
      </Head>
      <Page>
        <PageHeader
          title="Layouts"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Layouts' }]}
            />
          }>
          <Button variant="secondary" onClick={() => setIsOpen(true)}>
            + Add Layout
          </Button>
        </PageHeader>
        <Drawer open={isOpen} setOpen={setIsOpen}>
          <LayoutForm setOpen={setIsOpen} setRerender={setRerender} />
        </Drawer>

        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box sx={{ width: '100%' }}>
              <LayoutList rerender={rerender} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
