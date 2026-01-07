import { FC, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button, Field, Flex, InputText, Modal } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { PlusIcon } from '@phosphor-icons/react';
import { CloseIcon } from '@wraft/icon';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import FormList from 'components/Form/FormList';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import { PageInner } from 'common/Atoms';
import { FormSchema, Form } from 'schemas/form';
import { postAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { hasPermission } = usePermission();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(FormSchema) });

  const onSubmit = (formData: any) => {
    setLoading(true);
    const payload = { ...formData, fields: [], status: 'active' };
    postAPI(`forms`, payload)
      .then((response: any) => {
        setLoading(true);
        toast.success('Created Form Successfully');
        router.push(`/forms/${response?.id}`);
      })
      .catch((err) => {
        toast.error(err?.errors && JSON.stringify(err?.errors), {
          duration: 3000,
          position: 'top-right',
        });
        setLoading(false);
      });
  };

  const onOpenDrawer = () => {
    reset();
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
          {hasPermission('form', 'manage') && (
            <Button variant="secondary" onClick={onOpenDrawer} size="sm">
              <PlusIcon size={10} weight="bold" />
              Create Form
            </Button>
          )}
        </PageHeader>
        <PageInner>
          <FormList rerender={rerender} setRerender={setRerender} />
        </PageInner>
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
                loading={loading}
                onClick={handleSubmit(onSubmit)}>
                Create
              </Button>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        </>
      </Modal>
    </>
  );
};

export default Index;
