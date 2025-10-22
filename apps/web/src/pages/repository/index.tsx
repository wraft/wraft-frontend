import { FC } from 'react';
import Head from 'next/head';
import { Box } from '@wraft/ui';

import PageHeader from 'components/common/PageHeader';
import { Repository } from 'components/Repository';
import { PageInner } from 'common/Atoms';
import Page from 'common/PageFrame';

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
