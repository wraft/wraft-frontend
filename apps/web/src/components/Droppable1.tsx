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
import { Box, Button, Flex } from 'theme-ui';

export function Droppable({ list, onAttachApproval, onDeleteFlow }: any) {
  const [items, setItems] = useState([]);

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
    <Box
      as="div"
      ref={setNodeRef}
      className={`w-20 h-20 ${getColor(Number(props.id))} ${isDragging ? 'z-10' : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
        display: 'flex',
        padding: '0px 16px',
      }}
      {...attributes}
      {...listeners}>
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
      <Flex sx={{ ml: 'auto', alignItems: 'center' }}>
        <Button
          variant="buttonApproval"
          onClick={() => props.onAttachApproval(props.id)}>
          Add Approval
        </Button>
        <Button
          variant="btnSecondary"
          onClick={() => props.onDeleteFlow(props.id)}
          sx={{
            ml: 'auto',
            fontSize: 0,
            fontWeight: 600,
            fontFamily: 'heading',
            textTransform: 'uppercase',
          }}>
          Delete
        </Button>
      </Flex>
    </Box>
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
import { Box, Button, Flex } from 'theme-ui';

export function Droppable({ list, onAttachApproval, onDeleteFlow }: any) {
  const [items, setItems] = useState([]);

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
    <Box
      as="div"
      ref={setNodeRef}
      className={`w-20 h-20 ${getColor(Number(props.id))} ${isDragging ? 'z-10' : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
        display: 'flex',
        padding: '0px 16px',
      }}
      {...attributes}
      {...listeners}>
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
      <Flex sx={{ ml: 'auto', alignItems: 'center' }}>
        <Button
          variant="buttonApproval"
          onClick={() => props.onAttachApproval(props.id)}>
          Add Approval
        </Button>
        <Button
          variant="btnSecondary"
          onClick={() => props.onDeleteFlow(props.id)}
          sx={{
            ml: 'auto',
            fontSize: 0,
            fontWeight: 600,
            fontFamily: 'heading',
            textTransform: 'uppercase',
          }}>
          Delete
        </Button>
      </Flex>
    </Box>
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
