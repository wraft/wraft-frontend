import { FC } from 'react';
import Head from 'next/head';
import ThemeForm from '../../../../components/ThemeForm';
// import Page from '../../../../src/components/Page';
import Page from '../../../../components/PageFrame';
import { Box } from 'theme-ui';
import { HeadingFrame } from '../../../../components/Card';

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
