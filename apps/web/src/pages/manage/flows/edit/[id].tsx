import { FC } from 'react';
import Head from 'next/head';
import { Container, Flex } from 'theme-ui';

import FlowForm from 'components/Flow/FlowForm';
import ManageSidebar from 'common/ManageSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { menuLinks } from 'utils';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Flow | Wraft</title>
      </Head>
      <Page>
        <PageHeader title="Flows" desc="Manage > flows "></PageHeader>
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <FlowForm />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
