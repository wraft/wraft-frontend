import { FC } from 'react';

import Head from 'next/head';
import { Container, Flex } from 'theme-ui';

import FlowForm from '../../../components/FlowForm';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { menuLinks } from '../../../utils';

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
