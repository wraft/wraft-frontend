import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex, Input, Label, Text, Textarea } from 'theme-ui';
import { Button } from '@wraft/ui';

import FormList from 'components/FormList';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import Modal from 'components/Modal';
import Field from 'components/Field';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Forms - Wraft Docs</title>
        <meta name="description" content="Manage Forms" />
      </Head>
      <Page>
        <PageHeader title="Forms">
          <Box sx={{ ml: 'auto', pt: 2 }}>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              New Form
            </Button>
          </Box>
        </PageHeader>
        <Container variant="layout.pageFrame">
          <FormList />
        </Container>
      </Page>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isOpen && (
          <Box sx={{ minWidth: '518px' }}>
            <Box
              sx={{ p: 4, borderBottom: '1px solid', borderColor: 'border' }}>
              <Text as="p" variant="h4Medium">
                Create new form
              </Text>
            </Box>
            <Box sx={{ p: 4 }}>
              <Label>Name</Label>
              <Input></Input>
              <Label pt={3}>Description</Label>
              <Textarea></Textarea>
            </Box>
            <Flex sx={{ p: 4, gap: 3 }}>
              <Button variant="primary">Create</Button>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default Index;
