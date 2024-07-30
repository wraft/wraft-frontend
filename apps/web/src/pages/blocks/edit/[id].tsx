import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import { ErrorBoundary } from '@wraft/ui';

import TemplateForm from 'components/BlockTemplateForm';
import { HeadingFrame } from 'components/Card';
import Page from 'components/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit TemplateForm - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame title="Blocks / Edit Block" />
        <Box sx={{ pl: 4 }}>
          <ErrorBoundary>
            <TemplateForm />
          </ErrorBoundary>
        </Box>
      </Page>
    </>
  );
};

export default Index;
