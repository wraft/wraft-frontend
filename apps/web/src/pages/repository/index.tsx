import { FC } from 'react';
import Head from 'next/head';
import { Box } from '@wraft/ui';

import { PageInner } from 'common/Atoms';

import PageHeader from '../../components/common/PageHeader';
import Page from '../../components/common/PageFrame';
import { Repository } from '../../components/Repository';

const RepositoryIndex: FC = () => {
  return (
    <>
      <Head>
        <title>Repository | Wraft</title>
        <meta name="description" content="Manage your documents and files" />
      </Head>
      <Box>
        <Page>
          <PageHeader title="Documents Repository" />
          <PageInner>
            <Repository />
          </PageInner>
        </Page>
      </Box>
    </>
  );
};

export default RepositoryIndex;
