import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Field,
  Flex,
  InputText,
  Label,
  Select,
  Text,
  Avatar,
  Search,
  Drawer,
} from '@wraft/ui';
import { DeleteIcon } from '@wraft/icon';
import { X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { fetchAPI, postAPI, putAPI } from 'utils/models';

export interface Approver {
  id: string;
  name: string;
  profile_pic: string;
}

export interface StateFormData {
  state: string;
  type: string;
  approvers: Approver[];
}

interface StateFormProps {
  flowId: string;
  flowVersionId?: string;
  editingState: any | null;
  onClose: () => void;
  onSave: (savedState: any) => void;
  highestOrder: number;
}

const StateForm = ({
  flowId,
  flowVersionId: _flowVersionId,
  editingState,
  onClose,
  onSave,
  highestOrder,
}: StateFormProps) => {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<StateFormData>({
    defaultValues: {
      state: '',
      type: 'reviewer',
      approvers: [],
    },
  });

  useEffect(() => {
    if (editingState) {
      setValue('state', editingState.state || '');
      setValue('type', editingState.type || 'reviewer');
      setApprovers(editingState.approvers || []);
    } else {
      reset({
        state: '',
        type: 'reviewer',
        approvers: [],
      });
      setApprovers([]);
    }
  }, [editingState, setValue, reset]);

  const onUserSelect = (user: any) => {
    if (user) {
      const userExists = approvers.some((approver) => approver.id === user.id);
      if (userExists) {
        toast.error('User already added');
      } else {
        setApprovers([...approvers, user]);
      }
    }
  };

  const onRemoveUser = (user: Approver) => {
    setApprovers(approvers.filter((a) => a.id !== user.id));
  };

  const onSubmit = async (data: StateFormData) => {
    if (!data.state || data.state.trim() === '') {
      toast.error('State name is required');
      return;
    }

    if (approvers.length === 0) {
      toast.error('At least one approver is required');
      return;
    }

    try {
      setLoading(true);

      if (editingState) {
        // Update existing state
        const initialApproversIds =
          editingState.approvers?.map((a: Approver) => a.id) || [];
        const currentApproversIds = approvers.map((a) => a.id);

        const addedApprovers = currentApproversIds.filter(
          (id) => !initialApproversIds.includes(id),
        );
        const removedApprovers = initialApproversIds.filter(
          (id) => !currentApproversIds.includes(id),
        );

        const updateData = {
          state: data.state,
          type: data.type,
          order: editingState.order,
          approvers: {
            add: addedApprovers,
            remove: removedApprovers,
          },
        };

        const response: any = await putAPI(
          `states/${editingState.id}`,
          updateData,
        );
        toast.success('State updated successfully');
        // Response might be wrapped, extract the state if needed
        const savedState = response?.state || response;
        onSave(savedState);
      } else {
        // Create new state
        const createData = {
          state: data.state,
          type: data.type,
          order: highestOrder + 1,
          approvers: approvers.map((a) => a.id),
        };

        const response: any = await postAPI(
          `flows/${flowId}/states`,
          createData,
        );
        toast.success('State created successfully');
        // Response might be wrapped, extract the state if needed
        const savedState = response?.state || response;
        onSave(savedState);
      }

      onClose();
    } catch (error: any) {
      console.error('Failed to save state:', error);
      toast.error(
        error?.response?.data?.errors?.[0] ||
          'Failed to save state. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Drawer.Header>
        <Drawer.Title>
          {editingState ? 'Edit State' : 'Add New State'}
        </Drawer.Title>
        <X size={20} weight="bold" cursor="pointer" onClick={onClose} />
      </Drawer.Header>

      <Box flex={1} overflowY="auto" px="xl" py="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="State Name"
            required
            error={errors?.state?.message as string}>
            <InputText
              {...register('state', { required: 'State name is required' })}
              placeholder="Enter state name"
            />
          </Field>

          <Box mt="md">
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field: { name, value, onChange } }) => {
                const typeOptions = [
                  { value: 'reviewer', label: 'Review' },
                  { value: 'editor', label: 'Edit' },
                  { value: 'sign', label: 'Sign' },
                ];
                // Find the option object that matches the current value
                const selectedOption = typeOptions.find(
                  (opt) => opt.value === value,
                );
                return (
                  <Field
                    label="State Type"
                    required
                    error={errors?.type?.message as string}>
                    <Select
                      name={name}
                      value={selectedOption || null}
                      onChange={(newValue) => {
                        // Select component returns the value directly (string)
                        onChange(newValue);
                      }}
                      options={typeOptions}
                      placeholder="Select state type"
                    />
                  </Field>
                );
              }}
            />
          </Box>

          <Box mt="md">
            <Label mb="sm" required>
              Assignees
            </Label>
            <Search
              itemToString={(item: any) => item?.name || ''}
              placeholder="Search and add assignees..."
              minChars={1}
              onChange={(user: any) => {
                if (user) {
                  onUserSelect(user);
                }
              }}
              renderItem={(user: any) => (
                <Flex alignItems="center" gap="sm" p="sm">
                  <Avatar size="xs" src={user.profile_pic} alt={user.name} />
                  <Text fontSize="md" fontWeight="medium">
                    {user.name}
                  </Text>
                </Flex>
              )}
              search={async (query: string) => {
                try {
                  const data: any = await fetchAPI(`users/search?key=${query}`);
                  return data.users.filter(
                    (u: any) => !approvers.some((a) => a.id === u.id),
                  );
                } catch (error) {
                  console.error('Error searching users:', error);
                  return [];
                }
              }}
            />
          </Box>

          {approvers.length > 0 ? (
            <Box
              mt="md"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              overflow="hidden">
              {approvers.map((approver, idx) => (
                <Flex
                  key={approver.id}
                  justifyContent="space-between"
                  alignItems="center"
                  px="md"
                  py="sm"
                  borderBottom={
                    idx < approvers.length - 1 ? '1px solid' : 'none'
                  }
                  borderBottomColor="border">
                  <Flex alignItems="center" gap="sm">
                    <Avatar
                      size="xs"
                      src={approver.profile_pic}
                      alt={approver.name}
                    />
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="text.primary">
                      {approver.name}
                    </Text>
                  </Flex>
                  <Box
                    onClick={() => onRemoveUser(approver)}
                    cursor="pointer"
                    p="1"
                    borderRadius="4px">
                    <DeleteIcon width={16} height={16} color="error.500" />
                  </Box>
                </Flex>
              ))}
            </Box>
          ) : (
            <Box
              mt="md"
              border="1px dashed"
              borderColor="border"
              borderRadius="md"
              p="xl"
              textAlign="center"
              bg="gray.50">
              <Text color="text.secondary" fontSize="sm">
                No assignees added yet
              </Text>
            </Box>
          )}

          <Flex flexShrink="0" px="xl" py="md" gap="sm" mt="lg">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingState ? 'Update' : 'Create'}
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default StateForm;
