import { FC, useState } from 'react';
import Head from 'next/head';
import { Button, Drawer, useDrawer, Box, Flex, Text } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { Plus, X } from '@phosphor-icons/react';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import FieldText from 'components/FieldText';
import FormList from 'components/Form/FormList';
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
          <Button variant="tertiary" onClick={onOpenDrawer}>
            <Plus size={12} weight="bold" />
            Create From
          </Button>
        </PageHeader>
        <Box p="lg" minHeight="100%" bg="background-secondary">
          <FormList rerender={rerender} setRerender={setRerender} />
        </Box>
      </Page>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isOpen && (
          <Box as="form" minWidth="518px" onSubmit={handleSubmit(onSubmit)}>
            <Box py={3} px={4} borderBottom="solid 1px" borderColor="gray.400">
              <Text fontWeight="600">Create Form</Text>
            </Box>
            <Box p={4}>
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
                <Text color="error">
                  {errors.description.message as string}
                </Text>
              )}
            </Box>
            <Flex p={4} pt={0} gap={3}>
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
