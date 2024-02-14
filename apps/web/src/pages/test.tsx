import { FC } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Box } from 'theme-ui';

// import Page from '../src/components/PageFrame';

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
