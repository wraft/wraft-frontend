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
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIcon } from '@wraft/icon';
import { Box, Flex, Input, Label, useThemeUI } from 'theme-ui';

type Props = { items: any; setItems: any };

const FormFieldDroppable = ({ items, setItems }: Props) => {
  return <Box>{items && <Draggable items={items} setItems={setItems} />}</Box>;
};

export default FormFieldDroppable;

type DraggableValuesProps = {
  items: any;
  setItems: any;
};

const Draggable = ({ items, setItems }: DraggableValuesProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!active || !over || active.id === over.id) return;
    console.log(active, over, active.id, over.id);
    const activeValue = items.filter((s: any) => s.id == active.id)[0];
    const overValue = items.filter((s: any) => s.id == over.id)[0];
    const oldIndex = items.indexOf(activeValue);
    const newIndex = items.indexOf(overValue);
    const newArr = arrayMove(items, oldIndex, newIndex);
    setItems(newArr);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {items.map((item: any, index: number) => (
            <SortableItem key={index} item={item} />
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });
  const { theme } = useThemeUI();
  return (
    <Flex sx={{ alignItems: 'center' }}>
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
          transform: CSS.Transform.toString(transform),
          transition: transition,
          bg: 'white',
          borderRadius: '4px',
        }}>
        <Label sx={{ textTransform: 'capitalize' }}>
          {item.type === 'options' ? 'Multiple Choice' : item.type}
        </Label>
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
            defaultValue={item.name}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
