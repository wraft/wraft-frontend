import { FC } from 'react';
import Head from 'next/head';

import Page from 'components/PageFrameInner';
import MentionField from 'components/MentionsField';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Template | Wraft</title>
      </Head>
      <Page>
        <MentionField />
      </Page>
    </>
  );
};

export default Index;
