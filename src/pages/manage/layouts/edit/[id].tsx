import { FC, useState } from 'react';
import Head from 'next/head';
// import LayoutForm from '../../../../components/LayoutForm';
import Page from '../../../../components/PageFrame';
import { Box } from 'theme-ui';
import dynamic from 'next/dynamic';
import ModalCustom from '../../../../components/ModalCustom';

const LayoutFormFrame = dynamic(
  () => import('../../../../components/LayoutForm'),
  {
    ssr: false,
  },
);

const Index: FC = () => {
  const [isOpen, setOpen] = useState<boolean>(true);
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box variant="layout.pageFrame">
          <ModalCustom varient="right" isOpen={isOpen} setOpen={setOpen}>
            <LayoutFormFrame setOpen={setOpen} />
          </ModalCustom>
        </Box>
      </Page>
    </>
  );
};

export default Index;
