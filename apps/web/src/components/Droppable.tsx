import React, { useEffect, useState } from 'react';
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
import { Avatar, Box, Flex, Input, Label, Text, useThemeUI } from 'theme-ui';
import toast from 'react-hot-toast';
import { Button } from '@wraft/ui';

import { fetchAPI, putAPI } from 'utils/models';

import { StateState } from './FlowForm';
import Modal from './Modal';
import { ConfirmDelete } from './common';

type Props = {
  states: StateState[];
  setStates: (e: StateState[]) => void;
  setOrder: any;
};

export function Droppable({ states, setStates, setOrder }: Props) {
  const [items, setItems] = useState<StateState[]>([]);
  // useEffect(() => {
  //   setOrder(items);
  // }, [items]);

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
    console.log(active, over);
    const activeState = states.filter((s) => s.id == active.id)[0];
    const overState = states.filter((s) => s.id == over.id)[0];
    const oldIndex = states.indexOf(activeState);
    const newIndex = states.indexOf(overState);
    console.log(oldIndex, newIndex);
    const newArr = arrayMove(states, oldIndex, newIndex).map((i, index) => ({
      ...i,
      order: index + 1,
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

  const [users, setUsers] = useState<any>();
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
    // if (e.id) {
    //   const request = putAPI(`states/${props.state.id}`, {
    //     state: props.item.state,
    //     order: `${props.index}`,
    //     approvers: { remove: [], add: [e.id] },
    //   });
    //   toast.promise(request, {
    //     loading: 'Updating ...',
    //     success: 'Updated Successfully',
    //     error: 'Update Failed',
    //   });
    // }
  };

  const onRemoveUser = (user: any) => {
    console.log('remove', user);
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
    // if (e.id) {
    //   const request = putAPI(`states/${state.id}`, {
    //     state: props.item.state,
    //     order: `${props.index}`,
    //     approvers: { remove: [e.id], add: [] },
    //   });
    //   toast.promise(request, {
    //     loading: 'Updating ...',
    //     success: 'Updated Successfully',
    //     error: 'Update Failed',
    //   });
    // }
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

  const onDeleteState = () => {
    if (states && state) {
      const newArr = states.filter((s: any) => s.id !== state.id);
      const final = newArr.map((s: any, index: number) => ({
        ...s,
        order: index + 1,
      }));
      setStates(final);
      setDeleteOpen(false);
    }
  };

  const onChangeInput = (e: any) => {
    console.log('search', e.currentTarget.value);
    fetchAPI(`users/search?key=${e.currentTarget.value}`).then((data: any) => {
      console.log('👽search', data);
      const usr = data.users;
      setUsers(usr);
    });
  };

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
            marginTop: '28px',
          }}>
          <DragIcon
            color={themeui?.theme?.colors?.gray?.[200] || ''}
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
        <Label>Default State</Label>
        <Flex
          sx={{
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
        <Box>
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
                    <DeleteIcon width={12} height={12} />
                  </Box>
                </Flex>
              ))}
            </Box>
          )}
          <Box mt={3}>
            <Input onChange={(e) => onChangeInput(e)} />
            {users &&
              users.map((x: any) => (
                <Box
                  key={x?.name}
                  onClick={() => onUserSelect(x)}
                  sx={{
                    bg: 'background',
                    p: 2,
                    px: 3,
                    cursor: 'pointer',
                  }}>
                  <Text as="h4" color="text">
                    {x.name}
                  </Text>
                </Box>
              ))}
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
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
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
