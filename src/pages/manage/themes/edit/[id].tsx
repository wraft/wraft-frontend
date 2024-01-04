import { FC } from 'react';

import Head from 'next/head';
import { Box } from 'theme-ui';

// import Page from '../../../../src/components/Page';
import { HeadingFrame } from '../../../../components/Card';
import Page from '../../../../components/PageFrame';
import ThemeForm from '../../../../components/ThemeForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame title="Edit Theme" />
        <Box sx={{ pl: 4 }}>
          <ThemeForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;
