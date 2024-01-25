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
        transition: transition,
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
          variant="btnDelete"
          onClick={() => props.onDeleteFlow(props.id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M7.5 13.5C7.69891 13.5 7.88968 13.421 8.03033 13.2803C8.17098 13.1397 8.25 12.9489 8.25 12.75V8.25C8.25 8.05109 8.17098 7.86032 8.03033 7.71967C7.88968 7.57902 7.69891 7.5 7.5 7.5C7.30109 7.5 7.11032 7.57902 6.96967 7.71967C6.82902 7.86032 6.75 8.05109 6.75 8.25V12.75C6.75 12.9489 6.82902 13.1397 6.96967 13.2803C7.11032 13.421 7.30109 13.5 7.5 13.5ZM15 4.5H12V3.75C12 3.15326 11.7629 2.58097 11.341 2.15901C10.919 1.73705 10.3467 1.5 9.75 1.5H8.25C7.65326 1.5 7.08097 1.73705 6.65901 2.15901C6.23705 2.58097 6 3.15326 6 3.75V4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25C2.25 5.44891 2.32902 5.63968 2.46967 5.78033C2.61032 5.92098 2.80109 6 3 6H3.75V14.25C3.75 14.8467 3.98705 15.419 4.40901 15.841C4.83097 16.2629 5.40326 16.5 6 16.5H12C12.5967 16.5 13.169 16.2629 13.591 15.841C14.0129 15.419 14.25 14.8467 14.25 14.25V6H15C15.1989 6 15.3897 5.92098 15.5303 5.78033C15.671 5.63968 15.75 5.44891 15.75 5.25C15.75 5.05109 15.671 4.86032 15.5303 4.71967C15.3897 4.57902 15.1989 4.5 15 4.5ZM7.5 3.75C7.5 3.55109 7.57902 3.36032 7.71967 3.21967C7.86032 3.07902 8.05109 3 8.25 3H9.75C9.94891 3 10.1397 3.07902 10.2803 3.21967C10.421 3.36032 10.5 3.55109 10.5 3.75V4.5H7.5V3.75ZM12.75 14.25C12.75 14.4489 12.671 14.6397 12.5303 14.7803C12.3897 14.921 12.1989 15 12 15H6C5.80109 15 5.61032 14.921 5.46967 14.7803C5.32902 14.6397 5.25 14.4489 5.25 14.25V6H12.75V14.25ZM10.5 13.5C10.6989 13.5 10.8897 13.421 11.0303 13.2803C11.171 13.1397 11.25 12.9489 11.25 12.75V8.25C11.25 8.05109 11.171 7.86032 11.0303 7.71967C10.8897 7.57902 10.6989 7.5 10.5 7.5C10.3011 7.5 10.1103 7.57902 9.96967 7.71967C9.82902 7.86032 9.75 8.05109 9.75 8.25V12.75C9.75 12.9489 9.82902 13.1397 9.96967 13.2803C10.1103 13.421 10.3011 13.5 10.5 13.5Z"
              fill="#A5ABB2"
            />
          </svg>
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
