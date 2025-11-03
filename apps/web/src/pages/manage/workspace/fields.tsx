import { FC, useEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { Flex } from '@wraft/ui';

import { workspaceLinks } from '@constants/menuLinks';
import OrganisationInfo from 'components/manage/OrganisationInfo';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';

const CompanyForm: FC = () => {
  const { userProfile } = useAuth();
  const currentOrg = userProfile?.currentOrganisation?.name;

  useEffect(() => {
    if (currentOrg === 'Personal') {
      router.replace('/404');
    }
  }, [currentOrg]);

  if (currentOrg === 'Personal') return null;

  return (
    (currentOrg !== 'Personal' || '') && (
      <>
        <Head>
          <title>Manage Organization \ Fields | Wraft</title>
          <meta name="description" content="manage organization in wraft" />
        </Head>
        <Page>
          <PageHeader
            title={[
              { name: 'Manage', path: '/manage' },
              { name: 'Workspace', path: '/manage/workspace' },
              { name: 'Fields', path: '' },
            ]}
          />

          <PageInner>
            <Flex gap="xl">
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
          </PageInner>
        </Page>
      </>
    )
  );
};

export default CompanyForm;
