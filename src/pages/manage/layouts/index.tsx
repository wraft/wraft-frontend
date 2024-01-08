import React, { FC, useState } from 'react';

import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import LayoutForm from '../../../components/LayoutForm';
import LayoutList from '../../../components/LayoutList';
import ManageSidebar from '../../../components/ManageSidebar';
import ModalCustom from '../../../components/ModalCustom';
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
        <ModalCustom varient="right" isOpen={isOpen} setOpen={setIsOpen}>
          <LayoutForm setOpen={setIsOpen} setRerender={setRerender} />
        </ModalCustom>

        <Box variant="layout.pageFrame" pt={0}>
          <Container>
            <Flex>
              <ManageSidebar items={menuLinks} />
              <LayoutList rerender={rerender} />
            </Flex>
          </Container>
        </Box>
      </Page>
    </>
  );
};

export default Index;
