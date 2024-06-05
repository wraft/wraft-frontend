import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex, Text } from 'theme-ui';
import { Button } from '@wraft/ui';
import { Drawer } from '@wraft-ui/Drawer';
import { useForm } from 'react-hook-form';

import FormList from 'components/FormList';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import Modal from 'components/Modal';
import FormsFrom from 'components/FormsFrom';
import Field from 'components/Field';
import FieldText from 'components/FieldText';

type FormValues = {
  name: string;
  prefix: string;
  description: string;
};

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const { register, handleSubmit } = useForm<FormValues>();
  const [data, setData] = useState<FormValues>();
  const [trigger, setTrigger] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setData(data);
  };
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
          <FormList rerender={rerender} setRerender={setRerender} />
        </Container>
      </Page>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isOpen && (
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ minWidth: '518px' }}>
            <Box
              sx={{ p: 4, borderBottom: '1px solid', borderColor: 'border' }}>
              <Text as="p" variant="h4Medium">
                Create new form
              </Text>
            </Box>
            <Box sx={{ p: 4 }}>
              <Field
                name="name"
                label="Name"
                placeholder="Name"
                register={register}
                mb={3}
              />
              <Field
                name="prefix"
                label="Prefix"
                placeholder="PREFIX"
                register={register}
                mb={3}
              />
              <FieldText
                name="description"
                label="Description"
                defaultValue=""
                register={register}
              />
            </Box>
            <Flex sx={{ p: 4, pt: 0, gap: 3 }}>
              <Button
                type="submit"
                variant="primary"
                onClick={() => {
                  handleSubmit(onSubmit)();
                  setDrawerOpen(true);
                  setIsOpen(false);
                }}>
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}>
                Cancel
              </Button>
            </Flex>
          </Box>
        )}
      </Modal>
      <Drawer open={drawerOpen} setOpen={() => setDrawerOpen(false)}>
        <Flex sx={{ flexDirection: 'column', height: '100vh' }}>
          <Box
            sx={{
              p: 4,
              borderBottom: '1px solid',
              borderColor: 'border',
            }}>
            <Text variant="h6Bold">Create new form</Text>
          </Box>
          <Box sx={{ height: '100%', flexGrow: 1, overflow: 'auto', px: 4 }}>
            <FormsFrom
              items={items}
              setItems={setItems}
              formdata={data}
              trigger={trigger}
              setRerender={setRerender}
              setOpen={setDrawerOpen}
              setLoading={setLoading}
            />
          </Box>
          <Box p={4} onClick={() => setTrigger((prev) => !prev)}>
            <Button disabled={loading}>Create</Button>
          </Box>
        </Flex>
      </Drawer>
    </>
  );
};

export default Index;
