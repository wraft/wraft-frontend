import { FC } from 'react';
import Head from 'next/head';
import ProfileForm from '../../components/ProfileForm';
import Page from '../../components/PageFrame';
import { Flex } from 'theme-ui';
import Link from 'next/link';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Contens | Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/account">
            <a>Back to Profile</a>
          </Link>
        </Flex>
        <Flex>
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
