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
  Input,
  Label,
  Select,
  Text,
  useThemeUI,
} from 'theme-ui';
import toast from 'react-hot-toast';
import { Button, Modal, Search } from '@wraft/ui';

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((state: StateState, index: number) => {
          return (
            <Box key={state.id} mb="xxl">
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

  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  const themeui = useThemeUI();

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

  const onNameChange = (e: any) => {
    const newName = e.target.value;
    if (states && state) {
      const newState: StateState = {
        ...state,
        state: newName,
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

  const onTypeChange = (e: any) => {
    const newType = e.target.value;
    if (states && state) {
      const newState: StateState = {
        ...state,
        type: newType,
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

  useEffect(() => {
    if (sourceRef.current && targetRef.current) {
      const sourceStyle = window.getComputedStyle(sourceRef.current);
      const sourceWidth = sourceStyle.width;
      targetRef.current.style.minWidth = sourceWidth;
    }
  });

  return (
    <Flex sx={{ mt: `${index === 1 ? 0 : 4}` }}>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          flexShrink: 0,
        }}>
        <Box
          as="div"
          style={{
            transform: CSS.Transform.toString(transform),
            transition: transition,
            display: 'flex',
            padding: '16px',
            marginTop: '24px',
          }}>
          <DragIcon
            color={themeui?.theme?.colors?.gray?.[600] || ''}
            width={20}
            height={20}
            viewBox="0 0 24 24"
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          transform: CSS.Transform.toString(transform),
          transition: transition,
          bg: 'white',
          borderRadius: '4px',
        }}>
        <Label mb="md">Default State</Label>
        <Flex
          sx={{
            mb: 'md',
            position: 'relative',
            button: {
              display: 'none',
            },
            ':hover button': {
              display: 'block',
            },
            border: '1px solid',
            borderColor: 'border',
            borderRadius: '4px',
            color: 'GrayText',
          }}>
          <Input
            className={`${isDragging ? 'z-10' : ''}`}
            defaultValue={state.state}
            onChange={(e) => {
              onNameChange(e);
            }}
          />
          <Flex
            data-no-dnd="true"
            sx={{
              ml: 'auto',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 900,
              gap: 0,
            }}></Flex>
        </Flex>
        <Label mb="md">State Mode</Label>
        <Select
          defaultValue={state.type}
          onChange={(e) => {
            onTypeChange(e);
          }}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: '4px',

            backgroundColor: 'background',
            color: 'text',
            '& option': {
              backgroundColor: 'background',
              color: 'text',
            },
          }}>
          <option disabled value="">
            Select a State Mode
          </option>
          <option value="reviewer">Reviewer</option>
          <option value="editor">Editor</option>
          <option value="sign">Sign</option>
        </Select>

        <Box>
          {state.error && (
            <Text as={'p'} variant="error">
              {state.error}
            </Text>
          )}

          <Box>
            <Box mt="md">
              <Label mb="md">Select Assignee</Label>
              <Search
                itemToString={(item: any) => item?.name || ''}
                placeholder="Add Assignee"
                minChars={1}
                onChange={(user: any) => {
                  if (user) {
                    onUserSelect(user);
                  }
                }}
                renderItem={(user: any) => (
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.profile_pic}
                      alt="profile"
                      width={18}
                      height={18}
                    />
                    <Text variant="subM">{user.name}</Text>
                  </Flex>
                )}
                search={async (query: string) => {
                  try {
                    const data: any = await fetchAPI(
                      `users/search?key=${query}`,
                    );
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
            {state.approvers && state.approvers.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  border: '1px solid',
                  borderColor: 'border',
                  borderRadius: '4px',
                }}>
                {state.approvers.map((e: any) => (
                  <Flex
                    key={e.id}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 3,
                      py: 2,
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                      <Avatar
                        src={e.profile_pic}
                        alt="profile"
                        width={18}
                        height={18}
                      />
                      <Text
                        as={'p'}
                        ml={3}
                        variant="subM"
                        sx={{ color: 'gray.900' }}>
                        {e.name}
                      </Text>
                    </Box>
                    <Box
                      onClick={() => onRemoveUser(e)}
                      sx={{ cursor: 'pointer' }}>
                      <DeleteIcon width={12} height={12} color="#79828B" />
                    </Box>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: '28px',

          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}>
        <Button
          variant="ghost"
          onClick={() => {
            setDeleteOpen(true);
          }}>
          <CloseIcon width={18} height={18} />
        </Button>
      </Box>
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
    </Flex>
  );
};
