import { FC } from 'react';
import Head from 'next/head';
import LayoutForm from '../../../../components/LayoutForm';
import Page from '../../../../components/PageFrame';
import { Box } from 'theme-ui';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box variant="layout.pageFrame">
          <LayoutForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
