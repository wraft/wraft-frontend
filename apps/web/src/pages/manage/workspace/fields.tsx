import { FC } from 'react';
import Head from 'next/head';
import { Flex } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import OrganisationInfo from 'components/manage/OrganisationInfo';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';

const CompanyForm: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Organization \ Fields | Wraft</title>
        <meta name="description" content="manage organization in wraft" />
      </Head>
      <Page>
        <PageHeader
          title="Workspace"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'General' }]}
            />
          }
        />

        <Flex gap="md" my="md" px="md">
          <ManageSidebar items={workspaceLinks} />
          <Flex
            bg="background-primary"
            direction="column"
            minWidth="556px"
            border="solid 1px"
            borderColor="gray.400"
            borderRadius="lg"
            p="xl"
            px="2xl">
            <OrganisationInfo />
          </Flex>
        </Flex>
      </Page>
    </>
  );
};

export default CompanyForm;
