import { FC } from 'react';
import Head from 'next/head';
// import Page from '../src/components/PageFrame';

import { Box } from 'theme-ui';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('../components/PdfViewer'), {
  ssr: false,
});

const Contents: FC = () => {
  const url = '/static/final.pdf'; //'http://www.africau.edu/images/default/sample.pdf';
  return (
    <>
      <Head>
        <title>Contents | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Box>
        <PdfViewer url={url} pageNumber={1} />
      </Box>
    </>
  );
};

export default Contents;
