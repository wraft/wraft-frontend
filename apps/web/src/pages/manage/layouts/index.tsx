import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Drawer } from '@wraft-ui/Drawer';
import { Flex, Container, Button, Box } from 'theme-ui';

import LayoutForm from '../../../components/LayoutForm';
import LayoutList from '../../../components/LayoutList';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { menuLinks } from '../../../utils';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <Button
            variant="btnSecondary"
            sx={{ fontSize: 1 }}
            onClick={() => setIsOpen(true)}>
            Add Layout
          </Button>
        </PageHeader>
        <Drawer open={isOpen} setOpen={setIsOpen}>
          <LayoutForm setOpen={setIsOpen} setRerender={setRerender} />
        </Drawer>

        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box variant="layout.contentFrame">
              <LayoutList rerender={rerender} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
