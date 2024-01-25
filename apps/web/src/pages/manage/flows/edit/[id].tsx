import { FC } from 'react';

import Head from 'next/head';

// import FlowForm from '../../../../components/FlowForm';
import FlowForm from '../../../../components/FlowForm1';
import Page from '../../../../components/PageFrame';
import ManageSidebar from '../../../../components/ManageSidebar';
import { menuLinks } from '../../../../utils';

import { Container, Flex } from 'theme-ui';
import PageHeader from '../../../../components/PageHeader';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Flow - Wraft Docs</title>
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
