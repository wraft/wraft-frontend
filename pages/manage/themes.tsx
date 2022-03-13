import { FC } from 'react';
import Head from 'next/head';
import ManageSidebar from '../../src/components/ManageView';
import Page from '../../src/components/PageFrame';

import { Text} from 'theme-ui'

const ThemeIndex: FC = () => {
  return (
    <>
      <Head>
        <title>Manage - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
          <Text>Themes Index</Text>
      </Page>
    </>
  );
};

export default ThemeIndex;
