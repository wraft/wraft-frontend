import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex, Text } from 'theme-ui';
import { Button, Drawer, useDrawer } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { Plus, X } from '@phosphor-icons/react';

import FormList from 'components/FormList';
import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import FieldText from 'components/FieldText';
import PageHeader from 'common/PageHeader';
import Field from 'common/Field';
import Modal from 'common/Modal';

type FormValues = {
  name: string;
  prefix: string;
  description: string;
};

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [data, setData] = useState<FormValues | null>();
  const [trigger, _setTrigger] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [_loading, setLoading] = useState<boolean>(false);

  const mobileMenuDrawer = useDrawer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (formData: any) => {
    setData(formData);
    setDrawerOpen(true);
    setIsOpen(false);
  };

  const onCloseDrawer = () => {
    setDrawerOpen(false);
    setData(null);
    reset();
  };

  const onOpenDrawer = () => {
    reset();
    setData(null);
    setIsOpen(true);
  };

  return (
    <>
      <Head>
        <title>Forms | Wraft</title>
        <meta name="description" content="Manage Forms" />
      </Head>
      <Page>
        <PageHeader title="Forms">
          <Box sx={{ ml: 'auto', pt: 2 }}>
            <Button variant="secondary" onClick={onOpenDrawer}>
              <Plus size={12} weight="bold" />
              Create From
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
              sx={{
                py: 3,
                px: 4,
                borderBottom: 'solid 1px',
                borderColor: 'gray.400',
              }}>
              <Text sx={{ fontWeight: 600 }}>Create Form</Text>
            </Box>
            <Box sx={{ p: 4 }}>
              <Field
                name="name"
                label="Name"
                placeholder="Name"
                register={register}
                error={errors.name}
                mb={3}
              />
              <Field
                name="prefix"
                label="Prefix"
                placeholder="PREFIX"
                register={register}
                error={errors.prefix}
                mb={3}
              />
              <FieldText
                name="description"
                label="Description"
                defaultValue=""
                register={register}
              />
              {errors.description && errors.description.message && (
                <Text variant="error">
                  {errors.description.message as string}
                </Text>
              )}
            </Box>
            <Flex sx={{ p: 4, pt: 0, gap: 3 }}>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit(onSubmit)}>
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  setData(null);
                }}>
                Cancel
              </Button>
            </Flex>
          </Box>
        )}
      </Modal>
      <Drawer
        open={drawerOpen}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={onCloseDrawer}>
        <Drawer.Header>
          <Drawer.Title>Create Form</Drawer.Title>
          <X size={20} weight="bold" cursor="pointer" onClick={onCloseDrawer} />
        </Drawer.Header>

        <FormsFrom
          items={items}
          setItems={setItems}
          formdata={data}
          trigger={trigger}
          setRerender={setRerender}
          setOpen={onCloseDrawer}
          setLoading={setLoading}
        />
      </Drawer>
    </>
  );
};

export default Index;
