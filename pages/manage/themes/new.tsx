import { FC } from 'react';
import Head from 'next/head';
import Theme from '../../../src/components/ThemeForm';
import Page from '../../../src/components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Theme - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/themes">
            <a>Back</a>
          </Link>
          <Theme />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
