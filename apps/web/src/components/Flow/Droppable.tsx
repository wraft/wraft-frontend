import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CloseIcon, DeleteIcon, DragIcon } from '@wraft/icon';
import {
  Avatar,
  Box,
  Flex,
  InputText,
  Label,
  Select,
  Text,
  Button,
  Search,
  Field,
  Modal,
} from '@wraft/ui';
import toast from 'react-hot-toast';

import ConfirmDelete from 'common/ConfirmDelete';
import { fetchAPI } from 'utils/models';

import { StateState } from './FlowForm';

type Props = {
  states: StateState[];
  setStates: (e: StateState[]) => void;
  highestOrder: number;
};

export function Droppable({ states, setStates, highestOrder }: Props) {
  const [items, setItems] = useState<StateState[]>([]);
  const [expandedStateId, setExpandedStateId] = useState<string | null>(null);

  useEffect(() => {
    if (states && states.length > 0) {
      setItems(states);
    }
  }, [states]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!active || !over || active.id === over.id) return;
    const activeState = states.filter((s) => s.id == active.id)[0];
    const overState = states.filter((s) => s.id == over.id)[0];
    const oldIndex = states.indexOf(activeState);
    const newIndex = states.indexOf(overState);
    // Use sequential order based on array position (1, 2, 3, ...)
    // This ensures no conflicts when submitting
    const newArr = arrayMove(states, oldIndex, newIndex).map((i, index) => ({
      ...i,
      order: index + 1,
    }));
    setStates(newArr);
  };

  return (
    <Box>
      <Text
        color="text.primary"
        mb="md"
        fontSize="xs"
        fontWeight="semibold"
        textTransform="uppercase"
        letterSpacing="0.5px"
      >
        Drag and drop to reorder states
      </Text>

      <Box
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        overflow="hidden"
        bg="background.primary"
      >
        {/* Table Header */}
        <Box
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="border"
          px="md"
          py="sm"
        >
          <Flex alignItems="center">
            <Box w="50px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                Drag
              </Text>
            </Box>
            <Box w="50px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                #
              </Text>
            </Box>
            <Box flex="1" px="sm">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                State Name
              </Text>
            </Box>
            <Box w="100px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                Type
              </Text>
            </Box>
            <Box w="120px" textAlign="center" px="xs">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                Assignees
              </Text>
            </Box>
            <Box w="80px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                Actions
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Sortable Rows */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items.map((state: StateState, index: number) => {
              return (
                <Box key={state.id}>
                  <SortableItem
                    state={state}
                    states={items}
                    setStates={setStates}
                    index={index + 1}
                    isExpanded={expandedStateId === state.id}
                    onExpand={() => {
                      setExpandedStateId(
                        expandedStateId === state.id ? null : state.id,
                      );
                    }}
                    onCollapse={() => {
                      setExpandedStateId(null);
                    }}
                  />
                </Box>
              );
            })}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}

type SortableItemProps = {
  index: number;
  state: StateState;
  states: StateState[];
  setStates: (e: StateState[]) => void;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};
const SortableItem = ({
  index,
  setStates,
  state,
  states,
  isExpanded,
  onExpand,
  onCollapse,
}: SortableItemProps) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [editApprovers, setEditApprovers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      state: '',
      type: 'reviewer',
    },
  });

  const watchedStateName = watch('state');
  const watchedStateType = watch('type');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: state.id,
  });

  // Initialize edit form when expanded
  useEffect(() => {
    if (isExpanded) {
      setValue('state', state.state || '');
      setValue('type', state.type || 'reviewer');
      setEditApprovers(state.approvers || []);
    } else {
      // Reset form when collapsed
      reset({
        state: '',
        type: 'reviewer',
      });
      setEditApprovers([]);
    }
  }, [isExpanded, state, setValue, reset]);

  const onUserSelect = (user: any) => {
    if (user) {
      const userExists = editApprovers.some(
        (approver: any) => approver.id === user.id,
      );
      if (userExists) {
        toast.error('User already added');
      } else {
        setEditApprovers([...editApprovers, user]);
      }
    }
  };

  const onRemoveUser = (user: any) => {
    setEditApprovers(editApprovers.filter((a: any) => a.id !== user.id));
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    handleSubmit((data) => {
      if (!data.state || data.state.trim() === '') {
        toast.error('State name is required');
        return;
      }

      if (editApprovers.length === 0) {
        toast.error('At least one assignee is required');
        return;
      }

      if (states && state) {
        const updatedState: StateState = {
          ...state,
          state: data.state.trim(),
          type: data.type,
          approvers: editApprovers,
          error: undefined,
        };
        const newArr = states.map((s: any) => {
          if (s.id === state.id) {
            return updatedState;
          } else {
            return s;
          }
        });
        setStates(newArr);
        onCollapse();
        toast.success('State updated successfully');
      }
    })();
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setValue('state', state.state || '');
    setValue('type', state.type || 'reviewer');
    setEditApprovers(state.approvers || []);
    onCollapse();
  };

  const onDeleteState = () => {
    if (states && state) {
      const newArr = states.filter((s: any) => s.id !== state.id);
      const final = newArr.map((s: any, i: number) => ({
        ...s,
        order: i + 1,
      }));
      setStates(final);
      setDeleteOpen(false);
    }
  };

  const stateType = state?.type || 'reviewer';
  const stateTypeConfig: Record<
    string,
    { color: string; bg: string; label: string }
  > = {
    reviewer: { color: 'blue.600', bg: 'blue.50', label: 'Review' },
    editor: { color: 'green.600', bg: 'green.50', label: 'Edit' },
    sign: { color: 'purple.600', bg: 'purple.50', label: 'Sign' },
  };
  const config = stateTypeConfig[stateType] || stateTypeConfig.reviewer;
  const isEven = index % 2 === 0;

  return (
    <Box
      borderBottom="1px solid"
      borderColor="border"
      bg={isEven ? 'background.primary' : 'gray.25'}
      transition="all 0.15s ease"
      opacity={isDragging ? 0.5 : 1}
      transform={CSS.Transform.toString(transform)}
    >
      <Flex alignItems="center" px="md" py="sm">
        {/* Drag Handle */}
        <Box
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          w="50px"
          textAlign="center"
          cursor={isDragging ? 'grabbing' : 'grab'}
        >
          <DragIcon
            color={isDragging ? config.color : '#6B7280'}
            width={16}
            height={16}
            viewBox="0 0 24 24"
          />
        </Box>

        {/* Step Number */}
        <Box w="50px" textAlign="center">
          <Box
            bg={config.bg}
            color={config.color}
            borderRadius="full"
            w="24px"
            h="24px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
          >
            <Text fontSize="xs" fontWeight="bold">
              {index}
            </Text>
          </Box>
        </Box>

        {/* State Name */}
        <Box flex="1" px="sm">
          <Text
            as="div"
            fontSize="sm"
            fontWeight="medium"
            color="text.primary"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {state.state}
          </Text>
        </Box>

        {/* State Type */}
        <Box w="100px" textAlign="center">
          <Box
            bg={config.bg}
            color={config.color}
            borderRadius="sm"
            px="sm"
            py="xs"
            display="inline-block"
          >
            <Text fontSize="xs" fontWeight="medium" textTransform="capitalize">
              {config.label}
            </Text>
          </Box>
        </Box>

        {/* Assignees - Avatar Only */}
        <Box w="120px" textAlign="center" px="xs">
          {state.approvers && state.approvers.length > 0 ? (
            <Flex
              alignItems="center"
              gap="xs"
              flexWrap="wrap"
              justifyContent="center"
            >
              {state.approvers.slice(0, 3).map((approver: any) => (
                <Flex key={approver.id} alignItems="center" gap="xs">
                  <Avatar
                    size="xs"
                    src={approver.profile_pic}
                    alt={approver.name}
                  />
                  <Text fontSize="sm2" fontWeight={500}>
                    {approver.name}
                  </Text>
                </Flex>
              ))}
              {state.approvers.length > 3 && (
                <Text fontSize="sm2" color="text.secondary">
                  +{state.approvers.length - 3}
                </Text>
              )}
            </Flex>
          ) : (
            <Text fontSize="xs" color="text.secondary" fontStyle="italic">
              Unassigned
            </Text>
          )}
        </Box>

        {/* Actions */}
        <Box w="80px" textAlign="center">
          <Flex alignItems="center" gap="xs" justifyContent="center">
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isExpanded) {
                  handleCancelEdit();
                } else {
                  onExpand();
                }
              }}
            >
              {isExpanded ? 'Cancel' : 'Edit State'}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteOpen(true);
              }}
              color="error.500"
            >
              <CloseIcon width={14} height={14} />
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* Inline Edit Form - Accordion */}
      <Box
        borderTop={isExpanded ? '1px solid' : 'none'}
        borderColor="border"
        bg={isExpanded ? 'gray.50' : 'transparent'}
        overflow="hidden"
        maxHeight={isExpanded ? '1000px' : '0'}
        opacity={isExpanded ? 1 : 0}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        style={{
          transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        {isExpanded && (
          <Box p="xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSaveEdit(e);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Flex direction="column" gap="lg">
                {/* State Name */}
                <Field
                  label="State Name"
                  required
                  error={errors?.state?.message as string}
                >
                  <InputText
                    {...register('state', {
                      required: 'State name is required',
                    })}
                    placeholder="Enter state name"
                    autoFocus
                  />
                </Field>

                {/* State Type */}
                <Box>
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
                      const selectedOption = typeOptions.find(
                        (opt) => opt.value === value,
                      );
                      return (
                        <Field
                          label="State Type"
                          required
                          error={errors?.type?.message as string}
                        >
                          <Select
                            name={name}
                            value={selectedOption || null}
                            onChange={(newValue) => {
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

                {/* Assignees */}
                <Box>
                  <Label mb="sm" fontSize="sm" fontWeight="medium" required>
                    Assignees
                  </Label>
                  <Box mb="sm">
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
                          <Avatar
                            size="xs"
                            src={user.profile_pic}
                            alt={user.name}
                          />
                          <Text fontSize="md" fontWeight="medium">
                            {user.name}
                          </Text>
                        </Flex>
                      )}
                      search={async (query: string) => {
                        try {
                          const data: any = await fetchAPI(
                            `users/search?key=${query}`,
                          );
                          return data.users.filter(
                            (u: any) =>
                              !editApprovers.some((a: any) => a.id === u.id),
                          );
                        } catch (error) {
                          console.error('Error searching users:', error);
                          return [];
                        }
                      }}
                    />
                  </Box>

                  {editApprovers && editApprovers.length > 0 ? (
                    <Box
                      border="1px solid"
                      borderColor="border"
                      borderRadius="md"
                      overflow="hidden"
                      mt="sm"
                    >
                      {editApprovers.map((e: any, idx: number) => (
                        <Flex
                          key={e.id}
                          justifyContent="space-between"
                          alignItems="center"
                          px="md"
                          py="sm"
                          borderBottom={
                            idx < editApprovers.length - 1
                              ? '1px solid'
                              : 'none'
                          }
                          borderBottomColor="border"
                          bg="background.primary"
                          transition="all 0.2s ease"
                        >
                          <Flex alignItems="center" gap="sm">
                            <Avatar
                              size="xs"
                              src={e.profile_pic}
                              alt={e.name}
                            />
                            <Text
                              fontSize="md"
                              fontWeight="medium"
                              color="text.primary"
                            >
                              {e.name}
                            </Text>
                          </Flex>
                          <Box
                            onClick={() => onRemoveUser(e)}
                            cursor="pointer"
                            p="xs"
                            borderRadius="4px"
                            transition="all 0.2s ease"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(keyEvent: any) => {
                              if (
                                keyEvent.key === 'Enter' ||
                                keyEvent.key === ' '
                              ) {
                                keyEvent.preventDefault();
                                onRemoveUser(e);
                              }
                            }}
                          >
                            <DeleteIcon
                              width={16}
                              height={16}
                              color="error.500"
                            />
                          </Box>
                        </Flex>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      border="1px dashed"
                      borderColor="border"
                      borderRadius="md"
                      p="lg"
                      textAlign="center"
                      bg="gray.50"
                      mt="sm"
                    >
                      <Text color="text.secondary" fontSize="sm">
                        No assignees added yet. Add at least one assignee.
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Flex gap="sm" justifyContent="flex-end" mt="md">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveEdit(e);
                    }}
                    disabled={
                      !watchedStateName?.trim() || editApprovers.length === 0
                    }
                  >
                    Save Changes
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Box>
        )}
      </Box>

      <Modal
        ariaLabel="Delete State"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <ConfirmDelete
          setOpen={() => setDeleteOpen(false)}
          onConfirmDelete={() => onDeleteState()}
          text={`Are you sure you want to remove ${state.state} ?`}
          title="Delete State"
        />
      </Modal>
    </Box>
  );
};
