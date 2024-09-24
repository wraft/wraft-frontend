import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button, Box } from 'theme-ui';

import FlowForm from 'components/FlowForm';
import FlowList from 'components/FlowList';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'common/PageHeader';
import { Drawer } from 'common/Drawer';
import DescriptionLinker from 'common/DescriptionLinker';
import { menuLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);

  return (
    <>
      <Head>
        <title>Manage Flows | Wraft</title>
        <meta name="description" content="wraft flows" />
      </Head>
      <Page>
        <PageHeader
          title="Flows"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'Flows' }]}
            />
          }>
          <Button
            variant="buttonSecondary"
            onClick={() => {
              setIsOpen(true);
            }}>
            Add Flow
          </Button>
        </PageHeader>
        <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
          {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
        </Drawer>
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar items={menuLinks} />
            <Box sx={{ width: '100%' }}>
              <FlowList rerender={rerender} setRerender={setRerender} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
