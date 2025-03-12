import React, { useEffect, useState, useCallback } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { Box, Field, Flex, InputText as Input, Text, Toggle } from '@wraft/ui';
import { CloseIcon, DocumentsIcon, DragIcon } from '@wraft/icon';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  Trash,
  DotsSixVertical,
} from '@phosphor-icons/react';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { fetchAPI, postAPI, putAPI } from 'utils/models';
import { uuidRegex } from 'utils/regex';

import {
  FormFieldsSchema,
  FormFieldsType,
  capitalizeFirstLetter,
  getDuplicateFieldNames,
} from '../../schemas/formField';
import AnimatedButton from './AnimatedButton';
import {
  FieldType,
  BackendTypeMapping,
  getDefaultFieldConfig,
  FormField,
  FieldValue,
  FormElementTypes,
  FieldMap,
  getFieldTypeFromBackendType,
} from './FormFieldTypes';

export interface FormData {
  id?: string;
  name: string;
  prefix?: string;
  description: string;
  status?: string;
}

interface FormsFromProps {
  formdata: FormData;
  items: FormField[];
  setItems: React.Dispatch<React.SetStateAction<FormField[]>>;
  isEdit?: boolean;
  setRerender?: (e: boolean) => void;
  setOpen?: (e: boolean) => void;
  trigger?: boolean;
  setIsOpen?: (e: boolean) => void;
  setLoading?: (e: boolean) => void;
}

// Main component
const FormsFrom: React.FC<FormsFromProps> = ({
  formdata,
  items,
  setItems,
  isEdit = false,
  setRerender,
  setOpen,
  trigger,
  setLoading,
}) => {
  const [fieldTypes, setFieldTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [removedFields, setRemovedFields] = useState<string[]>([]);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Setup React Hook Form
  const { reset } = useForm<FormFieldsType>({
    resolver: zodResolver(FormFieldsSchema),
    defaultValues: {
      ...items,
    },
  });

  useEffect(() => {
    reset(items);
  }, [items, reset]);

  // Handle drag end for form fields
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  };

  const onAddField = (fieldType: FieldType) => {
    const backendType = BackendTypeMapping[fieldType];
    const fieldTypeObj = fieldTypes.find(
      (ft) => ft.name.toLowerCase() === backendType.toLowerCase(),
    );

    if (!fieldTypeObj) {
      return;
    }

    const newItem = {
      ...getDefaultFieldConfig(fieldType),
      fieldTypeId: fieldTypeObj.id,
    };

    // Normalize spaces, capitalize first letter, and trim
    newItem.name = capitalizeFirstLetter(
      newItem.name.replace(/\s+/g, ' ').trim(),
    );

    if (items) {
      setItems([...items, newItem]);
    } else {
      setItems([newItem]);
    }
  };

  const onAddOption = (id: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id && item.values) {
          return {
            ...item,
            values: [
              ...item.values,
              { name: '', id: Math.random().toString() },
            ],
          };
        }
        return item;
      }),
    );
  };

  const onRequiredChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { checked } = e.target;
    const updatedItems = [...items];
    updatedItems[index].required = !updatedItems[index].required;
    setItems(updatedItems);
  };

  const onLongChecked = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].long = !updatedItems[index].long;
    setItems(updatedItems);
  };

  const onMultipleChecked = (
    _e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedItems = [...items];
    updatedItems[index].multiple = !updatedItems[index].multiple;
    setItems(updatedItems);
  };

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
  ) => {
    // Get the input value
    const inputValue = e.target.value;

    // Normalize spaces: replace multiple consecutive spaces with a single space
    // but don't trim to allow spaces during typing
    const normalizedName = inputValue.replace(/\s+/g, ' ');

    // Capitalize first letter if there's input
    const capitalizedName = normalizedName
      ? capitalizeFirstLetter(normalizedName)
      : '';

    // Use functional update to avoid unnecessary array recreations
    setItems((prevItems) => {
      // Create updated items with the new name
      const updatedItems = prevItems.map((field) => {
        if (field.id === item.id) {
          return {
            ...field,
            name: capitalizedName,
            // Clear error when name is changed
            error: undefined,
          };
        }
        // Keep other fields as they are, but clear any duplicate name errors
        // This ensures only fields with the current duplicate name are marked
        if (field.error === 'Field label must be unique') {
          return {
            ...field,
            error: undefined,
          };
        }
        return field;
      });

      // Check if the new name would create duplicates (only check if not empty after trimming)
      if (capitalizedName.trim() !== '') {
        const duplicateNames = getDuplicateFieldNames(
          updatedItems as FormFieldsType,
        );

        if (duplicateNames.length > 0) {
          // Only mark fields with duplicate names as errors
          return updatedItems.map((field) => {
            if (duplicateNames.includes(field.name)) {
              return {
                ...field,
                error: 'Field label must be unique',
              };
            }
            return field;
          });
        }
      }

      // No duplicates, return updated items normally
      return updatedItems;
    });
  };

  const onOptionNameChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      item: FormField,
      value: FieldValue,
    ) => {
      // Get the input value
      const inputValue = e.target.value;

      // Normalize spaces: replace multiple consecutive spaces with a single space
      // but don't trim to allow spaces during typing
      const normalizedName = inputValue.replace(/\s+/g, ' ');

      // Immediately update the value for responsive typing
      setItems((prevItems) =>
        prevItems.map((field) => {
          if (field.id === item.id && field.values) {
            const updatedValues = field.values.map((val) => {
              if (val.id === value.id) {
                return { ...val, name: normalizedName };
              }
              return val;
            });

            return {
              ...field,
              values: updatedValues,
              // Keep existing error state during typing
            };
          }
          return field;
        }),
      );

      // Debounce validation to avoid checking on every keystroke
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setItems((prevItems) =>
          prevItems.map((field) => {
            if (field.id === item.id && field.values) {
              const updatedValues = field.values.map((val) => {
                if (val.id === value.id) {
                  return { ...val, name: normalizedName };
                }
                return val;
              });

              // Only check for empty options if we're clearing an error
              const hasEmptyOptions = updatedValues.some(
                (val) => val.name.trim() === '',
              );

              return {
                ...field,
                values: updatedValues,
                // Update error state after debounce
                error:
                  hasEmptyOptions && field.type === 'options'
                    ? 'All options require a name'
                    : undefined,
              };
            }
            return field;
          }),
        );
      }, 300); // 300ms debounce
    },
    [],
  );

  const onDuplicateField = (index: number, item: FormField) => {
    // Normalize spaces in the original name: replace multiple spaces with a single space and trim
    const normalizedName = item.name.replace(/\s+/g, ' ').trim();

    const duplicatedItem = {
      ...item,
      id: Math.random().toString(),
      // Ensure duplicated field has a unique name without unwanted spaces
      name: `${normalizedName} Copy`,
      // Clear any existing errors
      error: undefined,
    };

    const updatedItems = [...items];

    if (index < updatedItems.length) {
      updatedItems.splice(index + 1, 0, duplicatedItem);
    } else {
      updatedItems.push(duplicatedItem);
    }

    // Clear any existing duplicate name errors
    const clearedItems = updatedItems.map((field) => {
      if (field.error === 'Field label must be unique') {
        return {
          ...field,
          error: undefined,
        };
      }
      return field;
    });

    // Check for duplicate names
    const duplicateNames = getDuplicateFieldNames(
      clearedItems as FormFieldsType,
    );

    if (duplicateNames.length > 0) {
      // Only mark fields with duplicate names as errors
      const itemsWithErrors = clearedItems.map((field) => {
        if (duplicateNames.includes(field.name)) {
          return {
            ...field,
            error: 'Field label must be unique',
          };
        }
        return field;
      });

      setItems(itemsWithErrors);
    } else {
      // No duplicates, update items normally
      setItems(clearedItems);
    }
  };

  const onDeleteField = (index: number) => {
    if (uuidRegex.test(items[index].id)) {
      setRemovedFields((prev) => [...prev, items[index].id]);
    }

    const updatedItems = [...items];
    if (index < updatedItems.length) {
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };

  const onMoveUp = (index: number) => {
    if (index > 0 && index < items.length) {
      const updatedItems = [...items];
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index - 1, 0, itemToMove);
      setItems(updatedItems);
    }
  };

  const onMoveDown = (index: number) => {
    if (index >= 0 && index < items.length - 1) {
      const updatedItems = [...items];
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index + 1, 0, itemToMove);
      setItems(updatedItems);
    }
  };

  const onDeleteValue = (item: FormField, value: FieldValue) => {
    if (!item.values) return;

    const updatedItems = items.map((field) => {
      if (field.id === item.id) {
        const updatedValues = field.values?.filter((v) => v.id !== value.id);

        // Check if this was the last option
        if (!updatedValues || updatedValues.length === 0) {
          return {
            ...field,
            values: updatedValues,
            error: 'Field requires at least one option',
          };
        }

        return {
          ...field,
          values: updatedValues,
          // Clear error if it was related to options
          error:
            field.error === 'All options require a name'
              ? undefined
              : field.error,
        };
      }
      return field;
    });

    setItems(updatedItems);
  };

  // Add a function to handle option reordering
  const onReorderOptions = (itemId: string, newValues: FieldValue[]) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            values: newValues,
          };
        }
        return item;
      }),
    );
  };

  // API functions
  const onFetchFieldTypes = () => {
    fetchAPI('field_types')
      .then((data: any) => {
        setFieldTypes(data.field_types);
      })
      .catch((err) => console.log(err));
  };

  // Helper function to validate the form
  const validateForm = (): boolean => {
    // Check if form data exists
    if (!formdata) {
      toast.error('Missing Form Data');
      return false;
    }

    // Create a new array for validation
    let validatedItems = [...items];
    let isValid = true;

    // First, clear all existing errors
    validatedItems = validatedItems.map((item) => ({
      ...item,
      error: undefined,
    }));

    // Check for empty field names and uppercase first letter
    validatedItems.forEach((_item, index) => {
      // Normalize spaces in the name: replace multiple consecutive spaces with a single space
      // and trim leading/trailing spaces
      const normalizedName = validatedItems[index].name
        .replace(/\s+/g, ' ')
        .trim();

      validatedItems[index] = {
        ...validatedItems[index],
        name: normalizedName,
      };

      if (normalizedName === '') {
        validatedItems[index] = {
          ...validatedItems[index],
          error: 'Field label is required',
        };
        isValid = false;
      } else if (
        normalizedName.charAt(0) !== normalizedName.charAt(0).toUpperCase()
      ) {
        validatedItems[index] = {
          ...validatedItems[index],
          error: 'Field label must start with an uppercase letter',
        };
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error('All fields require a valid label');
    }

    // Check for duplicate field names
    const duplicateNames = getDuplicateFieldNames(
      validatedItems as FormFieldsType,
    );
    if (duplicateNames.length > 0) {
      duplicateNames.forEach((name) => {
        validatedItems.forEach((item, index) => {
          if (item.name === name) {
            validatedItems[index] = {
              ...item,
              error: 'Field label must be unique',
            };
            isValid = false;
          }
        });
      });

      toast.error(`Duplicate field labels: ${duplicateNames.join(', ')}`);
    }

    // Check if option fields have at least one option with a name
    validatedItems.forEach((item, index) => {
      if (item.type === 'options' || item.type === 'Radio Button') {
        // First check if values exist
        if (!item.values || item.values.length === 0) {
          validatedItems[index] = {
            ...item,
            error: 'Field requires at least one option',
          };
          isValid = false;
          toast.error(`${item.name || 'Field'} requires at least one option`);
          return; // Skip further checks for this item
        }

        // Normalize spaces in all option names
        const normalizedValues = item.values.map((val) => ({
          ...val,
          name: val.name.replace(/\s+/g, ' ').trim(),
        }));

        validatedItems[index] = {
          ...validatedItems[index],
          values: normalizedValues,
        };

        // Check if any option is empty after normalization
        if (normalizedValues.some((value) => value.name === '')) {
          validatedItems[index] = {
            ...validatedItems[index],
            error: 'All options require a name',
          };
          isValid = false;
          toast.error(`All options in ${item.name || 'field'} require a name`);
        }
      }
    });

    // Update items with validation errors
    setItems(validatedItems);

    return isValid;
  };

  const onSave = () => {
    if (!validateForm()) {
      setLoading && setLoading(false);
      return;
    }

    // return;

    setLoading && setLoading(true);

    // Prepare fields data for API
    const fields = items.map((item) => {
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

      // Normalize the name before sending to API: replace multiple spaces with a single space and trim
      const normalizedName = item.name.replace(/\s+/g, ' ').trim();

      const data: any = {
        name: normalizedName,
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
          setRerender && setRerender(!isEdit);
          setOpen && setOpen(false);
          setLoading && setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.errors && JSON.stringify(err?.errors), {
            duration: 3000,
            position: 'top-right',
          });
          setLoading && setLoading(false);
        });
    } else {
      setLoading && setLoading(true);
      postAPI(`forms`, data)
        .then(() => {
          toast.success('Created Successfully');
          setRerender && setRerender(true);
          setOpen && setOpen(false);
          setLoading && setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.errors && JSON.stringify(err?.errors), {
            duration: 3000,
            position: 'top-right',
          });
          setLoading && setLoading(false);
        });
    }
  };

  // Effects
  useEffect(() => {
    if (trigger) {
      onSave();
    }
  }, [trigger]);

  useEffect(() => {
    onFetchFieldTypes();
  }, []);

  return (
    <Flex justify="space-between" align="flex-start">
      <Box w="55%">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items &&
              items.map((item, index) => (
                <SortableFormField
                  key={item.id}
                  item={item}
                  index={index}
                  itemsLength={items.length}
                  onNameChange={onNameChange}
                  onOptionNameChange={onOptionNameChange}
                  onDeleteValue={onDeleteValue}
                  onAddOption={onAddOption}
                  onRequiredChecked={onRequiredChecked}
                  onLongChecked={onLongChecked}
                  onMultipleChecked={onMultipleChecked}
                  onDuplicateField={onDuplicateField}
                  onDeleteField={onDeleteField}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onReorderOptions={onReorderOptions}
                />
              ))}
          </SortableContext>
        </DndContext>
      </Box>

      <FormElementsPanel onAddField={onAddField} />
    </Flex>
  );
};

interface FormFieldItemProps {
  item: FormField;
  index: number;
  itemsLength: number;
  onNameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
  ) => void;
  onOptionNameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
    value: FieldValue,
  ) => void;
  onDeleteValue: (item: FormField, value: FieldValue) => void;
  onAddOption: (id: string) => void;
  onRequiredChecked: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onLongChecked: (index: number) => void;
  onMultipleChecked: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onDuplicateField: (index: number, item: FormField) => void;
  onDeleteField: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorderOptions: (itemId: string, newValues: FieldValue[]) => void;
}

// Create a new SortableFormField component that wraps FormFieldItem with drag functionality
const SortableFormField: React.FC<FormFieldItemProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FormFieldItem {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
};

// Create the FormFieldItem component that renders the actual field content
interface FormFieldItemDragProps extends FormFieldItemProps {
  dragHandleProps: {
    attributes: any;
    listeners: any;
  };
}

const FormFieldItem: React.FC<FormFieldItemDragProps> = ({
  item,
  index,
  itemsLength,
  onNameChange,
  onOptionNameChange,
  onDeleteValue,
  onAddOption,
  onRequiredChecked,
  onLongChecked,
  onMultipleChecked,
  onDuplicateField,
  onDeleteField,
  onMoveUp,
  onMoveDown,
  onReorderOptions,
  dragHandleProps,
}) => {
  const fieldTypeUI = getFieldTypeFromBackendType(item.type);
  const Icon = fieldTypeUI ? FieldMap[fieldTypeUI].icon : DocumentsIcon;
  const displayName = fieldTypeUI
    ? FieldMap[fieldTypeUI].displayName
    : item.type;

  return (
    <Box
      key={item.id}
      mb="md"
      p="lg"
      bg="background-primary"
      border="1px solid"
      borderRadius="sm"
      borderColor={item.error ? 'error' : 'border'}>
      <Flex justify="space-between" align="center" mb="md">
        <Flex align="center" gap="sm">
          <Box
            cursor="grab"
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}>
            <DotsSixVertical size={20} />
          </Box>
          <Flex align="center" gap="xs">
            <Icon width={24} />
            <Text fontWeight="heading">{displayName}</Text>
          </Flex>
        </Flex>

        <Flex align="center" gap="md">
          <Box w="18px" h="18px" onClick={() => onDuplicateField(index, item)}>
            <Copy size={18} />
          </Box>
          <Box w="18px" h="18px" onClick={() => onDeleteField(index)}>
            <Trash size={18} />
          </Box>
          {index !== 0 && (
            <Box w="18px" h="18px" onClick={() => onMoveUp(index)}>
              <ArrowUp size={18} />
            </Box>
          )}
          {index !== itemsLength - 1 && (
            <Box w="18px" h="18px" onClick={() => onMoveDown(index)}>
              <ArrowDown size={18} />
            </Box>
          )}
        </Flex>
      </Flex>

      <Field
        label="Field Label"
        error={item.error}
        required={true}
        hint="First letter must be uppercase and name must be unique">
        <Input
          placeholder="Enter field Label"
          value={item.name}
          onChange={(e) => onNameChange(e, item)}
        />
      </Field>

      {item.type === 'options' && (
        <OptionsSection
          item={item}
          onOptionNameChange={onOptionNameChange}
          onDeleteValue={onDeleteValue}
          onAddOption={onAddOption}
          onReorderOptions={onReorderOptions}
        />
      )}

      <FieldControls
        item={item}
        index={index}
        itemsLength={itemsLength}
        onRequiredChecked={onRequiredChecked}
        onLongChecked={onLongChecked}
        onMultipleChecked={onMultipleChecked}
        onDuplicateField={onDuplicateField}
        onDeleteField={onDeleteField}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </Box>
  );
};

interface OptionsSectionProps {
  item: FormField;
  onOptionNameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
    value: FieldValue,
  ) => void;
  onDeleteValue: (item: FormField, value: FieldValue) => void;
  onAddOption: (id: string) => void;
  onReorderOptions: (itemId: string, newValues: FieldValue[]) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  item,
  onOptionNameChange,
  onDeleteValue,
  onAddOption,
  onReorderOptions,
}) => {
  // Check if there are any empty option names after trimming
  const hasEmptyOptions = item.values?.some(
    (value) => value.name.trim() === '',
  );

  return (
    <>
      <Box mt="md">
        {hasEmptyOptions && (
          <Text color="error" fontSize="sm" mb="xs">
            All options require a name
          </Text>
        )}
        <DraggableValues
          item={item}
          onOptionNameChange={onOptionNameChange}
          onDeleteValue={onDeleteValue}
          onReorderOptions={onReorderOptions}
        />
      </Box>
      <Button
        variant="secondary"
        onClick={() => onAddOption(item.id)}
        style={{ width: '100%', marginTop: '16px' }}>
        <Flex align="center">
          <Plus size={20} color="currentColor" />
          <Text ml="sm">Add Option</Text>
        </Flex>
      </Button>
    </>
  );
};

interface FieldControlsProps {
  item: FormField;
  index: number;
  itemsLength: number;
  onRequiredChecked: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onLongChecked: (index: number) => void;
  onMultipleChecked: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onDuplicateField: (index: number, item: FormField) => void;
  onDeleteField: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const FieldControls: React.FC<FieldControlsProps> = ({
  item,
  index,
  onRequiredChecked,
  onLongChecked,
  onMultipleChecked,
}) => {
  const fieldTypeUI = getFieldTypeFromBackendType(item.type);

  return (
    <Flex justify="space-between" mt="md">
      <Flex gap="md">
        <Field label="Required">
          <Toggle
            size="sm"
            checked={item.required}
            onClick={(e: any) => onRequiredChecked(e, index)}
          />
        </Field>
        {fieldTypeUI === FieldType.LONG_TEXT && (
          <Field label="Long Answer">
            <Toggle
              size="sm"
              checked={item.long}
              onClick={() => onLongChecked(index)}
            />
          </Field>
        )}
        {fieldTypeUI === FieldType.OPTIONS && (
          <Field label="Multiple Answers">
            <Toggle
              size="sm"
              checked={item.multiple}
              onClick={(e: any) => onMultipleChecked(e, index)}
            />
          </Field>
        )}
      </Flex>
    </Flex>
  );
};

interface FormElementsPanelProps {
  onAddField: (fieldType: FieldType) => void;
}

const FormElementsPanel: React.FC<FormElementsPanelProps> = ({
  onAddField,
}) => {
  return (
    <Flex
      direction="column"
      bg="background-primary"
      border="1px solid"
      borderColor="border"
      mr="md"
      py="lg"
      px="lg">
      <Text fontSize="xl" fontWeight="heading">
        Form Elements
      </Text>
      <Text color="text-secondary" mb="md" mt="xs" fontSize="sm">
        Drag elements to your form or click to add
      </Text>
      <Flex direction="column" gap="md" mt="sm">
        {FormElementTypes.map((fieldType) => (
          <AnimatedButton
            key={fieldType}
            onClick={() => onAddField(fieldType)}
            fieldType={fieldType}
          />
        ))}
      </Flex>
    </Flex>
  );
};

// DraggableValues component
interface DraggableValuesProps {
  item: FormField;
  onOptionNameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
    value: FieldValue,
  ) => void;
  onDeleteValue: (item: FormField, value: FieldValue) => void;
  onReorderOptions: (itemId: string, newValues: FieldValue[]) => void;
}

const DraggableValues: React.FC<DraggableValuesProps> = ({
  item,
  onOptionNameChange,
  onDeleteValue,
  onReorderOptions,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id || !item.values) return;

    const oldIndex = item.values.findIndex((value) => value.id === active.id);
    const newIndex = item.values.findIndex((value) => value.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Create a new array with the reordered values
      const newValues = arrayMove(item.values, oldIndex, newIndex);
      // Update the parent component's state with the reordered values
      onReorderOptions(item.id, newValues);
    }
  };

  if (!item.values || item.values.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={item.values} strategy={rectSortingStrategy}>
        <Flex direction="column" gap="sm">
          {item.values.map((value) => (
            <SortableItem
              key={value.id}
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

// SortableItem component
interface SortableItemProps {
  value: FieldValue;
  item: FormField;
  onOptionNameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: FormField,
    value: FieldValue,
  ) => void;
  onDeleteValue: (item: FormField, value: FieldValue) => void;
}

const SortableItem = React.memo<SortableItemProps>(
  ({ value, item, onOptionNameChange, onDeleteValue }) => {
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

    const transformStyle = CSS.Transform.toString(transform);
    // Check if the value name is empty after trimming
    const isEmptyValue = value.name.trim() === '';

    return (
      <Flex
        align="center"
        border="1px solid"
        borderColor={isEmptyValue ? 'error' : 'border'}
        borderRadius="sm"
        bg="background-primary"
        style={{
          transform: transformStyle,
          transition: transition,
        }}>
        <Box
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          cursor="pointer"
          flexShrink={0}
          color="text-secondary"
          p="md">
          <DragIcon />
        </Box>
        <Input
          className={`${isDragging ? 'z-10' : ''}`}
          bg="background-primary"
          border="none"
          placeholder="Option Name"
          value={value.name}
          onChange={(e) => {
            onOptionNameChange(e, item, value);
          }}
          style={{ flexGrow: 1 }}
        />
        <Box color="text-secondary" p="md">
          <CloseIcon
            onClick={() => {
              onDeleteValue(item, value);
            }}
          />
        </Box>
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.value.name === nextProps.value.name &&
      prevProps.value.id === nextProps.value.id &&
      prevProps.item.id === nextProps.item.id &&
      (prevProps.item.error === nextProps.item.error ||
        (!prevProps.item.error && !nextProps.item.error))
    );
  },
);

// Add display name
SortableItem.displayName = 'SortableItem';

export default FormsFrom;
