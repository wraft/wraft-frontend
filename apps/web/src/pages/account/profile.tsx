import { FC } from 'react';
import Head from 'next/head';
import { Flex } from 'theme-ui';

import Page from 'components/PageFrame';
import ProfileForm from 'components/ProfileForm';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Contens | Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
