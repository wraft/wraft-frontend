import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import LayoutList from '../../../components/LayoutList';
import LayoutForm from '../../../components/LayoutForm';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';
import ModalLeft from '../../../components/ModalLeft';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <Button onClick={() => setIsOpen(true)}>Add Layout</Button>
        </PageHeader>
        <ModalLeft isOpen={isOpen} setOpen={setIsOpen}>
          <LayoutForm />
        </ModalLeft>

        <Box variant="layout.pageFrame" pt={0}>
          <Container>
            <Flex>
              <ManageSidebar items={menuLinks} />
              <LayoutList />
            </Flex>
          </Container>
        </Box>
      </Page>
    </>
  );
};

export default Index;
