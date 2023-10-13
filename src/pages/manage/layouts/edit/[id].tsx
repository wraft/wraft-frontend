import { FC } from 'react';
import Head from 'next/head';
// import LayoutForm from '../../../../components/LayoutForm';
import Page from '../../../../components/PageFrame';
import { Box } from 'theme-ui';
import dynamic from 'next/dynamic';

const LayoutFormFrame = dynamic(
  () => import('../../../../components/LayoutForm'),
  {
    ssr: false,
  },
);

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box variant="layout.pageFrame">
          <LayoutFormFrame />
        </Box>
      </Page>
    </>
  );
};

export default Index;
