import { FC } from 'react';
import Head from 'next/head';

import ContentListAll from '../components/ContentList';
import Page from '../components/PageFrame';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Contents | Wraft </title>
        <meta name="description" content="wraft contents" />
      </Head>
      <Page>
        <ContentListAll />
      </Page>
    </>
  );
};

export default Contents;
