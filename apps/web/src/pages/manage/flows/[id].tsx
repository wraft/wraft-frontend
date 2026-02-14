import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { DropdownMenu, Modal, Flex, Box, Button, Text } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';
import { PencilSimple } from '@phosphor-icons/react';

import FlowViewForm from 'components/Flow/FlowViewForm';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PageInner, IconFrame } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import Field from 'common/Field';
import { fetchAPI, deleteAPI, putAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const [flow, setFlow] = useState<any>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] =
    useState<boolean>(false);
  const [isSavingName, setIsSavingName] = useState<boolean>(false);
  const router = useRouter();
  const id: string = router.query.id as string;
  const { hasPermission } = usePermission();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      fetchAPI(`flows/${id}`).then((data: any) => {
        setFlow(data);
        reset({ name: data?.flow?.name || '' });
      });
    }
  }, [id, reset]);

  useEffect(() => {
    if (isEditNameModalOpen && flow?.flow?.name) {
      reset({ name: flow.flow.name });
    }
  }, [isEditNameModalOpen, flow?.flow?.name, reset]);

  const handleOpenEditNameModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditNameModalOpen(true);
  };

  const handleCloseEditNameModal = () => {
    setIsEditNameModalOpen(false);
    reset({ name: flow?.flow?.name || '' });
  };

  const onSaveName = async (data: { name: string }) => {
    if (!data.name.trim()) {
      toast.error('Flow name cannot be empty', {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    if (data.name.trim() === flow?.flow?.name) {
      setIsEditNameModalOpen(false);
      return;
    }

    try {
      setIsSavingName(true);
      await putAPI(`flows/${id}`, { name: data.name.trim() });

      // Update local state
      setFlow((prev: any) => ({
        ...prev,
        flow: {
          ...prev?.flow,
          name: data.name.trim(),
        },
      }));

      setIsEditNameModalOpen(false);
      toast.success('Flow name updated successfully', {
        duration: 2000,
        position: 'top-right',
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.errors?.[0] || 'Failed to update flow name',
        {
          duration: 3000,
          position: 'top-right',
        },
      );
    } finally {
      setIsSavingName(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAPI(`flows/${id}`);
      toast.success('Flow deleted successfully', {
        duration: 2000,
        position: 'top-right',
      });
      setDeleteOpen(false);
      router.push('/manage/flows');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.errors?.[0] || 'Failed to delete flow',
        {
          duration: 3000,
          position: 'top-right',
        },
      );
    }
  };
  return (
    <>
      <Head>
        <title>Edit Flow | Wraft</title>
      </Head>
      <Page noSide>
        <PageHeader
          title={[
            {
              name: 'Manage',
              path: '/manage',
            },
            {
              name: 'Flows',
              path: '/manage/flows',
            },
            {
              name: (
                <Flex alignItems="center" gap="xs" as="span">
                  <Text as="span" fontSize="base" fontWeight={500}>
                    {flow?.flow?.name || 'Loading...'}
                  </Text>
                  {hasPermission('flow', 'manage') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit flow name"
                      type="button"
                      onMouseDown={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenEditNameModal(e);
                      }}>
                      <IconFrame color="gray.800">
                        <PencilSimple size={16} weight="regular" />
                      </IconFrame>
                    </Button>
                  )}
                </Flex>
              ) as any,
              path: '.',
            },
          ]}
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Flows', path: '/manage/flows' },
                { name: `${flow?.flow?.name || ''}` },
              ]}
            />
          }>
          {hasPermission('flow', 'delete') && (
            <Flex alignItems="center" gap="sm">
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    p="xs"
                    borderRadius="sm">
                    <ThreeDotIcon width={20} height={20} />
                  </Flex>
                </DropdownMenu.Trigger>
                <DropdownMenu aria-label="Flow actions">
                  <DropdownMenu.Item
                    onClick={() => {
                      setDeleteOpen(true);
                    }}>
                    Delete Flow
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenu.Provider>
            </Flex>
          )}
        </PageHeader>

        <Modal
          ariaLabel="Edit Flow Name"
          open={isEditNameModalOpen}
          onClose={handleCloseEditNameModal}>
          <Box as="form" onSubmit={handleSubmit(onSaveName)} w="450px">
            <Modal.Header>Edit Flow Name</Modal.Header>
            <Box my={3}>
              <Field
                name="name"
                label="Flow Name"
                placeholder="Enter flow name"
                register={register}
                error={errors.name}
                defaultValue={flow?.flow?.name || ''}
              />
            </Box>
            <Flex gap="sm" justifyContent="flex-end">
              <Button
                variant="secondary"
                onClick={handleCloseEditNameModal}
                disabled={isSavingName}
                type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSavingName}
                disabled={isSavingName}>
                Save
              </Button>
            </Flex>
          </Box>
        </Modal>

        <Modal
          ariaLabel="Delete Flow"
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}>
          <ConfirmDelete
            title="Delete Flow"
            text={`Are you sure you want to delete '${flow?.flow?.name || ''}'? This action cannot be undone.`}
            setOpen={setDeleteOpen}
            onConfirmDelete={handleDelete}
          />
        </Modal>

        <PageInner>
          <FlowViewForm />
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
