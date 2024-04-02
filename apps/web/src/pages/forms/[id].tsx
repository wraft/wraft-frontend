import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Collection Form - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <Box
          sx={{
            p: 4,
            px: 5,
            maxWidth: '70ch',
            maxHeight: '100dvh',
            overflowY: 'auto',
          }}>
          <FormsFrom />
        </Box>
      </Page>
    </>
  );
};

export default Index;
