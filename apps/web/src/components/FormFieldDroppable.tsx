import React from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIcon } from '@wraft/icon';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';

type Props = { items: any; handleDragEnd: any };

const FormFieldDroppable = ({ items, handleDragEnd }: Props) => {
  return (
    <Box>
      {items && <Draggable items={items} handleDragEnd={handleDragEnd} />}
    </Box>
  );
};

export default FormFieldDroppable;

type DraggableValuesProps = {
  items: any;
  handleDragEnd: any;
};

const Draggable = ({ items, handleDragEnd }: DraggableValuesProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Flex sx={{ flexDirection: 'column' }}>
          {items.map((item: any, index: number) => (
            <Box
              key={index}
              sx={{
                borderTop: index === 0 ? 'none' : '1px solid',
                borderColor: 'border',
              }}>
              <SortableItem item={item} />
            </Box>
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

type SortableItemProps = {
  item: any;
};
const SortableItem = ({ item }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });
  const { theme } = useThemeUI();
  return (
    <Flex
      sx={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        alignItems: 'center',
        bg: 'background',
        py: 2,
      }}>
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
            display: 'flex',
            padding: '16px',
          }}>
          <DragIcon
            color={theme?.colors?.gray?.[200] || ''}
            width={20}
            height={20}
            viewBox="0 0 24 24"
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
        }}>
        <Text as="p" variant="capM" sx={{ textTransform: 'capitalize', mb: 0 }}>
          {item.type === 'options' ? 'Multiple Choice' : item.type}
        </Text>
        <Text as="p" variant="subB" sx={{ color: 'green.700' }}>
          {item.name}
        </Text>
      </Box>
    </Flex>
  );
};
