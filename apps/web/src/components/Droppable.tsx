import React, { useEffect, useState } from 'react';

// import { Button as BaseButton } from '@ariakit/react';
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
import { Box, Button, Flex } from 'theme-ui';

import { IconWrapper } from './Atoms';

type Props = {
  list: any;
  onAttachApproval: any;
  onDeleteFlow: any;
  setOrder: any;
};

export function Droppable({
  list,
  onAttachApproval,
  onDeleteFlow,
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
        {items.map((id: any, index: number) => {
          return (
            <Box
              key={id}
              sx={{
                borderBottom: '1px solid #E4E9EF;',
              }}>
              <SortableItem
                index={index + 1}
                id={id}
                onAttachApproval={onAttachApproval}
                onDeleteFlow={onDeleteFlow}
              />
            </Box>
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

const SortableItem = (props: {
  id: string;
  index: number;
  onAttachApproval: any;
  onDeleteFlow: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
  });

  return (
    <Flex
      sx={{
        button: {
          display: 'none',
        },
        ':hover button': {
          display: 'block',
        },
      }}>
      <Box
        as="div"
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
          display: 'flex',
          padding: '0px 16px',
        }}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`w-20 h-20 ${getColor(Number(props.id))} ${isDragging ? 'z-10' : ''}`}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: '13px',
            gap: '16px',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '18px',
              height: '18px',
              fontSize: '9.6px',
              background: '#E4E9EF',
              borderRadius: '74px',
            }}>
            {props.index}
          </Box>
          <Box
            sx={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#2C3641',
            }}>
            {props.id}
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
        }}>
        <Button
          type="button"
          data-no-dnd="true"
          variant="btnDelete"
          sx={{ p: 0, border: 0, bg: 'transparent', mr: 1 }}
          onClick={() => props.onAttachApproval(props)}>
          <IconWrapper stroke={2}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </IconWrapper>
        </Button>
        <Button
          type="button"
          variant="btnDelete"
          data-no-dnd="true"
          sx={{ p: 0, border: 0, bg: 'transparent', mr: 1 }}
          onClick={() => props.onDeleteFlow(props.id)}>
          <IconWrapper stroke={2}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </IconWrapper>
        </Button>
      </Flex>
    </Flex>
  );
};

const getColor = (item: number) => {
  switch (item) {
    case 1:
      return 'bg-red-400';
    case 2:
      return 'bg-blue-400';
    case 3:
      return 'bg-pink-400';
    case 4:
      return 'bg-yellow-400';
    case 5:
      return 'bg-purple-400';
    default:
      return 'bg-black';
  }
};
