import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button } from 'theme-ui';

import FlowList from '../../../components/FlowList';
import Page from '../../../components/PageFrame';

import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';
import PageHeader from '../../../components/PageHeader';
import ModalCustom from '../../../components/ModalCustom';
import FlowForm from '../../../components/FlowForm';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  console.log('render state', rerender);
  return (
    <>
      <Head>
        <title>Manage Flows - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>

      <Page>
        <PageHeader
          title="Manage Flows"
          desc="Manage Configurations for your workspace">
          {/* <Link variant="btnSecondary" href="/manage/flows/new"> */}
          <Button
            onClick={() => {
              setIsOpen(true);
            }}>
            Add Flow
          </Button>
        </PageHeader>
        <ModalCustom varient="center" isOpen={isOpen} setOpen={setIsOpen}>
          <FlowForm setOpen={setIsOpen} setRerender={setRerender} />
        </ModalCustom>
        <Container sx={{ pl: 4, pt: 4 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowList rerender={rerender} />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
