import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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

import { fetchAPI, putAPI } from 'utils/models';

type Props = {
  list: any;
  onAttachApproval: any;
  deleteState: any;
  setOrder: any;
};

export function Droppable({
  list,
  onAttachApproval,
  deleteState,
  setOrder,
}: Props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setOrder(items);
  }, [items]);

  useEffect(() => {
    // Update items when the list prop changes
    if (list && list.length > 0) {
      setItems(list.map((item: any) => item.name));
    }
  }, [list]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!active || !over || active.id === over.id) return;
    setItems((items: any) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((name: any, index: number) => {
          return (
            <Box key={name}>
              <SortableItem
                index={index + 1}
                name={name}
                onAttachApproval={onAttachApproval}
                deleteState={deleteState}
              />
            </Box>
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

const SortableItem = (props: {
  name: string;
  index: number;
  onAttachApproval: any;
  deleteState: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.name,
  });

  const router = useRouter();
  const flowId: string = router.query.id as string;

  const [users, setUsers] = useState<any>();
  const [approvers, setApprovers] = useState<any>();
  const [state, setState] = useState<any>();
  const themeui = useThemeUI();

  useEffect(() => {
    if (flowId) {
      fetchAPI(`flows/${flowId}/states`).then((data: any) => {
        const currentState = data.states.filter(
          (s: any) => s.state.state === props.name,
        )[0];
        setState(currentState.state);
        console.log(state, data, currentState);
        if (currentState.state.approvers) {
          setApprovers(currentState.state.approvers);
        }
      });
    }
  }, []);

  const onUserSelect = (e: any) => {
    if (e.id) {
      const request = putAPI(`states/${state.id}`, {
        state: props.name,
        order: `${props.index}`,
        approvers: { remove: [], add: [e.id] },
      });

      toast.promise(request, {
        loading: 'Updating ...',
        success: 'Updated Successfully',
        error: 'Update Failed',
      });
    }
  };

  const onRemoveUser = (e: any) => {
    if (e.id) {
      const request = putAPI(`states/${state.id}`, {
        state: props.name,
        order: `${props.index}`,
        approvers: { remove: [e.id], add: [] },
      });

      toast.promise(request, {
        loading: 'Updating ...',
        success: 'Updated Successfully',
        error: 'Update Failed',
      });
    }
  };

  const onChangeInput = (e: any) => {
    console.log('search', e.currentTarget.value);
    fetchAPI(`users/search?key=${e.currentTarget.value}`).then((data: any) => {
      const usr = data.users;
      setUsers(usr);
    });
  };

  return (
    <Flex>
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
          <Box
            as="div"
            style={{
              display: 'flex',
              padding: '0px 16px',
            }}
            className={`w-20 h-20 
         ${isDragging ? 'z-10' : ''}`}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: '13px',
                gap: '16px',
              }}>
              <Box
                sx={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2C3641',
                }}>
                {props.name}
              </Box>
            </Box>
          </Box>
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
          {approvers && approvers.length > 0 && (
            <Box
              sx={{
                mt: 3,
                border: '1px solid',
                borderColor: 'border',
                borderRadius: '4px',
              }}>
              {approvers.map((e: any) => (
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
            <Input onChange={(e) => onChangeInput(e)}></Input>
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
                  <Text as="em" color="gray.600">
                    {x.email}
                  </Text>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: 3,
          mt: '28px',
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
        onClick={() => {
          props.deleteState(props.name);
        }}>
        <CloseIcon width={18} height={18} />
      </Box>
    </Flex>
  );
};
