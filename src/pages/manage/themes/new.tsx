import { FC } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { Flex } from 'theme-ui';

import Page from '../../../components/PageFrame';
import Theme from '../../../components/ThemeForm';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/manage/themes">Back</Link>
          <Theme />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
