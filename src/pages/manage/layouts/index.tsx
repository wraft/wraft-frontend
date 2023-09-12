import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Close } from 'theme-ui';
import LayoutList from '../../../components/LayoutList';
import LayoutForm from '../../../components/LayoutForm';
import Page from '../../../components/PageFrame';
import ManageSidebar from '../../../components/ManageSidebar';
import { HeadingFrame } from '../../../components/Card';
import Link from '../../../components/NavLink';
import { menuLinks } from '../../../utils';
import Modal from 'react-modal';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame
          title="Manage"
          side={
            // <Link variant="btnPrimary" href="/manage/layouts/new">
            //   Add Layout
            // </Link>
            <Button onClick={() => setIsOpen(true)}>Add Laybout</Button>
          }
        />
        <Modal
          isOpen={isOpen}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.50)',
            },
            content: {
              marginLeft: 'auto',
              minWidth: '582px',
              width: '40%',
              height: '100%',
              right: '0px',
              top: '0px',
              borderRadius: '0px',
            },
          }}>
          <Close onClick={() => setIsOpen(false)} sx={{ cursor: 'pointer' }} />
          <LayoutForm />
        </Modal>
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <LayoutList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
