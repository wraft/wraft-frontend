import { FC } from 'react';
import Head from 'next/head';
import ContentListAll from '../src/components/ContentList';
import Page from '../src/components/PageFrame';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Contents | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <ContentListAll />
      </Page>
    </>
  );
};

export default Contents;
