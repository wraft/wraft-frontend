import { FC } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';

import ProfileForm from 'components/User/ProfileForm';
import OrgSidebar from 'common/OrgSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>My Account | Wraft</title>
        <meta name="description" content="my wraft account" />
      </Head>
      <Page>
        <PageHeader
          title="My Account"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Settings', path: '' },
                { name: 'My Account', path: '' },
              ]}
            />
          }
        />

        <Flex gap="md" my="md" px="md">
          <OrgSidebar />
          <ProfileForm />
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
