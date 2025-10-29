import React, { useEffect, useRef, useState } from 'react';
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
  Modal,
  Search,
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

  useEffect(() => {
    if (states && states.length > 0) {
      setItems(states);
    }
  }, [states]);

  const sensors = useSensors(
    useSensor(PointerSensor),
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
    const newArr = arrayMove(states, oldIndex, newIndex).map((i, index) => ({
      ...i,
      order: highestOrder + 1 + index,
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
        letterSpacing="0.5px">
        Drag and drop to reorder states
      </Text>

      <Box
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        overflow="hidden"
        bg="background.primary">
        {/* Table Header */}
        <Box
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="border"
          px="md"
          py="sm">
          <Flex alignItems="center">
            <Box w="50px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                Drag
              </Text>
            </Box>
            <Box w="50px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                #
              </Text>
            </Box>
            <Box flex="1" px="sm">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                State Name
              </Text>
            </Box>
            <Box w="100px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                Type
              </Text>
            </Box>
            <Box w="120px" textAlign="center" px="xs">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                Assignees
              </Text>
            </Box>
            <Box w="80px" textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.5px">
                Actions
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Sortable Rows */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items.map((state: StateState, index: number) => {
              return (
                <Box key={state.id}>
                  <SortableItem
                    state={state}
                    states={items}
                    setStates={setStates}
                    index={index + 1}
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
};
const SortableItem = ({
  index,
  setStates,
  state,
  states,
}: SortableItemProps) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [showAssignees, setShowAssignees] = useState<boolean>(false);

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

  const onUserSelect = (user: any) => {
    if (states && state) {
      const userExists = state.approvers.some(
        (approver: any) => approver.id === user.id,
      );
      if (userExists) {
        toast.error('user already exists');
      } else {
        const newState: StateState = {
          ...state,
          approvers: [...state.approvers, user],
          error: undefined,
        };
        const newArr = states.map((s: any) => {
          if (s.id === state.id) {
            return newState;
          } else {
            return s;
          }
        });
        setStates(newArr);
      }
    }
  };

  const onRemoveUser = (user: any) => {
    if (states && state) {
      const filterdApprovers = state.approvers.filter(
        (a: any) => a.id !== user.id,
      );
      const newState: StateState = {
        ...state,
        approvers: filterdApprovers,
      };
      const newArr = states.map((s: any) => {
        if (s.id === state.id) {
          return newState;
        } else {
          return s;
        }
      });
      setStates(newArr);
    }
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
      transform={CSS.Transform.toString(transform)}>
      <Flex alignItems="center" px="md" py="sm">
        {/* Drag Handle */}
        <Box
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          w="50px"
          textAlign="center"
          cursor={isDragging ? 'grabbing' : 'grab'}>
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
            mx="auto">
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
            whiteSpace="nowrap">
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
            display="inline-block">
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
              justifyContent="center">
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
              onClick={() => setShowAssignees(true)}>
              Edit State
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeleteOpen(true)}
              color="error.500">
              <CloseIcon width={14} height={14} />
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* Assignee Management Modal */}
      <Modal
        ariaLabel="Manage Assignees"
        open={showAssignees}
        onClose={() => setShowAssignees(false)}>
        <Box p="xl" w="400px">
          <Text fontSize="lg" fontWeight="semibold" mb="md">
            Manage Assignees for {state.state}
          </Text>

          <Box mb="md">
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
                    (u: any) =>
                      !state.approvers.some((a: any) => a.id === u.id),
                  );
                } catch (error) {
                  console.error('Error searching users:', error);
                  return [];
                }
              }}
            />
          </Box>

          {state.approvers && state.approvers.length > 0 ? (
            <Box
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              overflow="hidden">
              {state.approvers.map((e: any, idx: number) => (
                <Flex
                  key={e.id}
                  justifyContent="space-between"
                  alignItems="center"
                  px="md"
                  py="sm"
                  borderBottom={
                    idx < state.approvers.length - 1 ? '1px solid' : 'none'
                  }
                  borderBottomColor="border">
                  <Flex alignItems="center" gap="sm">
                    <Avatar size="xs" src={e.profile_pic} alt={e.name} />
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="text.primary">
                      {e.name}
                    </Text>
                  </Flex>
                  <Box
                    onClick={() => onRemoveUser(e)}
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
        </Box>
      </Modal>

      <Modal
        ariaLabel="Delete State"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}>
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
