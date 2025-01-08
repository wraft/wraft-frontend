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
import { Box, Flex, Input, Label, Switch, Text } from 'theme-ui';
import { CloseIcon, DocumentsIcon, DragIcon } from '@wraft/icon';
import { ArrowDown, ArrowUp, Copy, Plus, Trash } from '@phosphor-icons/react';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';

import { fetchAPI, postAPI, putAPI } from 'utils/models';
import { uuidRegex } from 'utils/regex';

import AnimatedButton from './AnimatedButton';

type Props = {
  formdata: any;
  items: any;
  setItems: any;
  isEdit?: boolean;
  setRerender?: (e: any) => void;
  setOpen?: (e: any) => void;
  trigger?: boolean;
  setIsOpen?: any;
  setLoading?: any;
};

const FormsFrom = ({
  formdata,
  items,
  setItems,
  isEdit = false,
  setRerender,
  setOpen,
  trigger,
  setLoading,
}: Props) => {
  const [fieldTypes, setFieldTypes] = useState<any[]>([]);
  const [removedFields, setRemovedFields] = useState<string[]>([]);

  const onAddField = (
    type:
      | 'Email'
      | 'Date'
      | 'Time'
      | 'Text'
      | 'Radio Button'
      | 'String'
      | 'File Input',
  ) => {
    const fieldTypeId = fieldTypes.find(
      (ft: any) => ft.name.toLowerCase() === type.toLowerCase(),
    ).id;
    if (!fieldTypeId) {
      return;
    }

    const newItem: any = {
      name: '',
      type: type,
      id: Math.random().toString(),
      required: false,
      fieldTypeId: fieldTypeId,
    };
    if (type === 'Radio Button') {
      newItem.multiple = false;
      newItem.values = [];
    } else if (type === 'File Input') {
      newItem.fileSize = 2000;
    }
    if (items) {
      setItems([...items, newItem]);
    } else {
      setItems([newItem]);
    }
  };

  const onAddOption = (id: string) => {
    const newItem = items.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          values: [...item.values, { name: '', id: Math.random().toString() }],
        };
      }
      return item;
    });
    setItems(newItem);
  };

  const onRequiredChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].required === checked) {
      data[index].required = false;
    } else {
      data[index].required = checked;
    }
    setItems(data);
  };

  const onLongChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].long === checked) {
      data[index].long = false;
    } else {
      data[index].long = checked;
    }
    setItems(data);
  };

  const onMultipleChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].multiple === checked) {
      data[index].multiple = false;
    } else {
      data[index].multiple = checked;
    }
    setItems(data);
  };

  const onNameChange = (e: any, item: any) => {
    const newName = e.target.value;
    const newItem = {
      ...item,
      name: newName,
      error: newName.length > 0 ? undefined : 'Field Name is required',
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onOptionNameChange = (e: any, item: any, value: any) => {
    const newName = e.target.value;
    const newValue = {
      ...value,
      name: newName,
    };
    const newItem = {
      ...item,
      error: newName.length > 0 ? undefined : 'Option Name is required',
      values: item.values.map((s: any) => {
        if (s.id === value.id) {
          return newValue;
        } else {
          return s;
        }
      }),
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onDuplicateField = (index: number, item: any) => {
    const cpyItem = { ...item, id: Math.random().toString() };
    const newArr = [...items];
    if (index < newArr.length) {
      newArr.splice(index + 1, 0, cpyItem);
      setItems(newArr);
    } else {
      newArr.push(cpyItem);
      setItems(newArr);
    }
  };

  const onDeleteField = (index: number) => {
    if (uuidRegex.test(items[index].id)) {
      setRemovedFields((prev) => [...prev, items[index].id]);
    }
    const newArr = [...items];
    if (index < newArr.length) {
      newArr.splice(index, 1);
      setItems(newArr);
    }
  };

  const onMoveUp = (index: number) => {
    const data = [...items];
    if (index > 0 && index < data.length) {
      const itemToMove = data.splice(index, 1)[0];
      data.splice(index - 1, 0, itemToMove);
      setItems(data);
    }
  };

  const onMoveDown = (index: number) => {
    const data = [...items];
    if (index >= 0 && index < data.length) {
      const itemToMove = data.splice(index, 1)[0];
      data.splice(index + 1, 0, itemToMove);
      setItems(data);
    }
  };

  const onDeleteValue = (item: any, value: any) => {
    const data = [...item.values];
    const filtered = data.filter((v: any) => v.id !== value.id);
    const newArr = items.map((i: any) => {
      if (i.id === item.id) {
        return { ...i, values: filtered };
      } else return { ...i };
    });
    setItems(newArr);
  };

  const onFetchFieldTypes = () => {
    fetchAPI('field_types')
      .then((data: any) => {
        setFieldTypes(data.field_types);
      })
      .catch((err) => console.log(err));
  };

  const onSave = () => {
    if (formdata === undefined) {
      toast.error('Missing Data');
      return;
    }
    if (items.some((item: any) => item.name === '')) {
      const data = items.map((item: any) => {
        if (item.name === '') {
          return {
            ...item,
            error: 'Field Name is required',
          };
        } else {
          return item;
        }
      });
      setItems(data);
      return toast.error('All fields are required');
    }
    const fields = items.map((item: any) => {
      const validations = [];
      if (item.required !== undefined) {
        validations.push({
          validation: {
            value: item.required,
            rule: 'required',
          },
          error_message: `can't be blank`,
        });
      }
      if (item.fileSize !== undefined) {
        validations.push({
          validation: {
            value: item.fileSize,
            rule: 'file_size',
          },
          error_message: `can't be more than ${item.fileSize} KB`,
        });
      }
      const data: any = {
        name: item.name,
        meta: {},
        field_type_id: item.fieldTypeId,
        description: '',
        validations: validations,
      };

      if (uuidRegex.test(item.id)) {
        data.field_id = item.id;
      }
      return data;
    });
    const deletedFields = removedFields.map((id) => ({ field_id: id }));
    const data = {
      status: formdata?.status || 'active',
      prefix: formdata?.prefix,
      name: formdata.name,
      fields: [...fields, ...deletedFields],
      description: formdata.description,
    };

    if (isEdit) {
      putAPI(`forms/${formdata.id}`, data)
        .then(() => {
          toast.success('Updated Successfully');
          setRerender && setRerender((prev: boolean) => !prev);
          setOpen && setOpen(false);
        })
        .catch((err) => {
          toast.error(err?.errors && JSON.stringify(err?.errors), {
            duration: 3000,
            position: 'top-right',
          });
        });
    } else {
      setLoading(true);
      postAPI(`forms`, data)
        .then(() => {
          toast.success('Created Successfully');
          setRerender && setRerender((prev: boolean) => !prev);
          setOpen && setOpen(false);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.errors && JSON.stringify(err?.errors), {
            duration: 3000,
            position: 'top-right',
          });
        });
    }
  };

  useEffect(() => {
    // onSave();
  }, [trigger]);

  useEffect(() => {
    console.table(items);
  }, [items]);

  useEffect(() => {
    onFetchFieldTypes();
  }, []);

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        height: '90vh',
        width: isEdit ? '50%' : 'auto',
      }}>
      <Box sx={{ height: '100%', flexGrow: 1, overflow: 'auto', px: 4 }}>
        <Box sx={{ bg: 'white', border: '1px solid', borderColor: 'border' }}>
          <Box>
            {items &&
              items.map((item: any, index: number) => (
                <Box
                  key={item.id}
                  sx={{ mt: 3, p: 4, borderBottom: '1px solid #eee' }}>
                  <Label>Field Name</Label>
                  <Input
                    defaultValue={item.name}
                    placeholder="Enter field Name"
                    onChange={(e) => onNameChange(e, item)}></Input>
                  {item.error && <Text variant="error">{item.error}</Text>}
                  {item.type === 'options' && (
                    <Box mt={3}>
                      <DraggableValues
                        item={item}
                        items={items}
                        setItems={setItems}
                        onOptionNameChange={onOptionNameChange}
                        onDeleteValue={onDeleteValue}
                      />
                      <Flex
                        sx={{ flexDirection: 'column', width: '100%' }}
                        mt={3}>
                        <Button
                          variant="secondary"
                          onClick={() => onAddOption(item.id)}>
                          <Flex
                            sx={{
                              alignItems: 'center',
                              color: 'gray.800',
                            }}>
                            <Plus size={20} />
                            <Text sx={{ ml: 2 }}>Add Option</Text>
                          </Flex>
                        </Button>
                      </Flex>
                    </Box>
                  )}
                  <Flex sx={{ justifyContent: 'space-between' }}>
                    <Flex sx={{ gap: 3, mt: 3 }}>
                      <Box>
                        <Switch
                          label="Required"
                          sx={{
                            bg: 'gray.500',
                          }}
                          checked={item.required}
                          onChange={(e) => onRequiredChecked(e, index)}
                        />
                      </Box>
                      {item.type === 'text' && (
                        <Box>
                          <Switch
                            label="Long Answer"
                            sx={{ bg: 'gray.100' }}
                            checked={item.long}
                            onChange={(e) => onLongChecked(e, index)}
                          />
                        </Box>
                      )}
                      {item.type === 'options' && (
                        <Box>
                          <Switch
                            label="Multiple Answers"
                            sx={{ bg: 'gray.100' }}
                            checked={item.long}
                            onChange={(e) => onMultipleChecked(e, index)}
                          />
                        </Box>
                      )}
                    </Flex>
                    <Flex sx={{ alignItems: 'center', gap: 3 }}>
                      <Button
                        variant="none"
                        onClick={() => onDuplicateField(index, item)}>
                        <Copy size={20} />
                      </Button>
                      <Button
                        variant="none"
                        onClick={() => onDeleteField(index)}>
                        <Trash width={24} />
                      </Button>
                      <Button
                        variant="none"
                        disabled={index + 1 === items.length}
                        onClick={() => onMoveDown(index)}>
                        <ArrowDown size={20} />
                      </Button>
                      <Button
                        variant="none"
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}>
                        <ArrowUp width={20} />
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))}
          </Box>
          <Flex sx={{ gap: 3, p: 4 }}>
            <AnimatedButton text="Text" onClick={() => onAddField('String')}>
              <DocumentsIcon />
            </AnimatedButton>
            <AnimatedButton text="Long Text" onClick={() => onAddField('Text')}>
              <Box sx={{ fontWeight: '700', fontSize: '16px' }}>L</Box>
            </AnimatedButton>
            {/* <AnimatedButton text="Date" onClick={() => onAddField('Date')}>
          <DateIcon />
        </AnimatedButton> */}
            {/* <AnimatedButton
          disabled
          text="Image"
          onClick={() => onAddField('File Input')}>
          <Box sx={{ fontWeight: '700', fontSize: '16px' }}>I</Box>
        </AnimatedButton> */}
            {/* <AnimatedButton
          disabled
          text="Multiple Choice"
          onClick={() => onAddField('Radio Button')}>
          <MultipleChoiceIcon />
        </AnimatedButton> */}
            {/* <AnimatedButton text="Time" onClick={() => onAddField('Time')} disabled>
          <TimeIcon />
        </AnimatedButton> */}
            {/* <AnimatedButton
          text="Email"
          onClick={() => onAddField('Email')}
          disabled>
          <MailIcon />
        </AnimatedButton> */}
          </Flex>
        </Box>
      </Box>
      <Box p={4}>
        <Button type="submit" onClick={onSave}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Flex>
  );
};

export default FormsFrom;

type DraggableValuesProps = {
  item: any;
  items: any;
  setItems: any;
  onOptionNameChange: any;
  onDeleteValue: any;
};

const DraggableValues = ({
  item,
  items,
  setItems,
  onOptionNameChange,
  onDeleteValue,
}: DraggableValuesProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!active || !over || active.id === over.id) return;
    const activeValue = item.values.filter((s: any) => s.id == active.id)[0];
    const overValue = item.values.filter((s: any) => s.id == over.id)[0];
    const oldIndex = item.values.indexOf(activeValue);
    const newIndex = item.values.indexOf(overValue);
    const cpyValues = [...item.values];
    const newArr = arrayMove(cpyValues, oldIndex, newIndex);
    const data = items.map((i: any) => {
      if (i.id === item.id) {
        return { ...i, values: newArr };
      } else return { ...i };
    });
    setItems([]);
    setTimeout(() => {
      setItems(data);
    }, 0);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={item.values} strategy={rectSortingStrategy}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {item.values.map((value: any, index: number) => (
            <SortableItem
              key={index}
              item={item}
              value={value}
              onOptionNameChange={onOptionNameChange}
              onDeleteValue={onDeleteValue}
            />
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

type SortableItemProps = {
  value: any;
  item: any;
  onOptionNameChange: any;
  onDeleteValue: any;
};
const SortableItem = ({
  value,
  item,
  onOptionNameChange,
  onDeleteValue,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: value.id,
  });
  return (
    <Flex
      sx={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: '4px',
        bg: 'background-primary',
      }}>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          flexShrink: 0,
          color: 'gray.400',
        }}>
        <Box
          as="div"
          style={{
            display: 'flex',
            padding: '16px',
          }}>
          <DragIcon width={20} height={20} viewBox="0 0 24 24" />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          borderRadius: '4px',
        }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              p: 2,
              flexShrink: '0',
              width: '14px',
              height: '14px',
              border: '2px solid',
              borderColor: 'border',
              borderRadius: '99px',
            }}
          />
          <Input
            className={`${isDragging ? 'z-10' : ''}`}
            sx={{ bg: 'background-primary', border: 'none' }}
            placeholder="Option Name"
            defaultValue={value.name}
            onChange={(e) => {
              onOptionNameChange(e, item, value);
            }}
          />
          <Box
            sx={{
              p: 2,
              px: 3,
              color: 'gray.900',
            }}>
            <Button variant="none" onClick={() => onDeleteValue(item, value)}>
              <CloseIcon width={16} />
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
