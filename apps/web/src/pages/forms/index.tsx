import { FC, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Drawer,
  Field,
  Flex,
  InputText,
  Modal,
  useDrawer,
} from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { Plus, X } from '@phosphor-icons/react';
import { CloseIcon } from '@wraft/icon';
import { zodResolver } from '@hookform/resolvers/zod';

import FormsFrom from 'components/Form/FormsFrom';
import FormList from 'components/Form/FormList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { FormSchema, Form } from 'schemas/form';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [data, setData] = useState<Form | null>();
  const [trigger, _setTrigger] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [_loading, setLoading] = useState<boolean>(false);

  const mobileMenuDrawer = useDrawer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(FormSchema) });

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
          <Button variant="tertiary" onClick={onOpenDrawer}>
            <Plus size={12} weight="bold" />
            Create Form
          </Button>
        </PageHeader>
        <Box p="lg" minHeight="100%" bg="background-secondary">
          <FormList rerender={rerender} setRerender={setRerender} />
        </Box>
      </Page>
      <Modal
        ariaLabel="Create Form"
        open={isOpen}
        onClose={() => setIsOpen(false)}>
        <>
          <Flex justify="space-between">
            <Modal.Header>Create Form</Modal.Header>
            <Box onClick={() => setIsOpen(false)}>
              <CloseIcon color="#2C3641" />
            </Box>
          </Flex>
          <Flex
            borderTop="1px solid"
            color="border"
            as="form"
            minWidth="518px"
            direction="column"
            gap="md"
            py="sm"
            onSubmit={handleSubmit(onSubmit)}>
            <Field label="Name" required error={errors?.name?.message}>
              <InputText
                {...register('name')}
                placeholder="Enter a From Name"
              />
            </Field>
            <Field
              label="Description"
              required
              error={errors?.description?.message}>
              <InputText
                {...register('description')}
                placeholder="Enter a Description"
              />
            </Field>
            <Field label="Prefix" required error={errors?.description?.message}>
              <InputText {...register('prefix')} placeholder="Enter a prefix" />
            </Field>
            <Flex mt="sm" gap="sm">
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
          </Flex>
        </>
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
