import { FC } from 'react';
import Head from 'next/head';
import { Flex, Container } from 'theme-ui';

import FlowList from '../../../components/FlowList';
import Page from '../../../components/PageFrame';
import Link from '../../../components/NavLink';

import ManageSidebar from '../../../components/ManageSidebar';
import { menuLinks } from '../../../utils';
import PageHeader from '../../../components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Manage Flows - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>

      <Page>
        <PageHeader
          title="Manage Flows"
          desc="Manage Configurations for your workspace">
          <Link variant="btnSecondary" href="/manage/flows/new">
            Add Flow
          </Link>
        </PageHeader>
        <Container sx={{ pl: 4, pt: 4 }}>
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowList />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
