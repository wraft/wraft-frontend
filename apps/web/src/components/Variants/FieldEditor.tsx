import React, { useCallback, useMemo } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import {
  Button,
  Box,
  Flex,
  InputText,
  Field,
  Select,
  Toggle,
  Text,
} from '@wraft/ui';
import { TrashIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { DragIcon } from '@wraft/icon';
import { useWatch } from 'react-hook-form';
import { arrayMove } from '@dnd-kit/sortable';

import { IconFrame } from 'common/Atoms';
import { convertToVariableName } from 'utils/index';

const FieldForm = ({
  fieldtypes,
  trigger,
  control,
  register,
  errors,
  setValue,
  getValues,
}: any) => {
  const { fields, append, remove, move } = useFieldArray({
    name: 'fields',
    control,
  });

  const sortedFields = useMemo(() => {
    return [...fields].sort((a: any, b: any) => {
      const orderA = a.order !== undefined && a.order !== null ? a.order : 0;
      const orderB = b.order !== undefined && b.order !== null ? b.order : 0;
      return orderA - orderB;
    });
  }, [fields]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onAddField = useCallback(async () => {
    const isValid = await trigger(`fields`);

    if (isValid) {
      const currentFields = control._formValues?.fields || [];
      const maxOrder =
        currentFields.length > 0
          ? Math.max(...currentFields.map((f: any) => f.order || 0))
          : -1;
      append({
        name: '',
        type: '',
        fromFrame: false,
        required: false,
        order: maxOrder + 1,
        machine_name: '',
        values: [],
        validations: [],
      });
    }
  }, [trigger, append, control]);

  const handleRemoveField = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  const handleTypeChange = useCallback(
    (index: number, onChange: (value: any) => void, newValue: any) => {
      onChange(newValue);
      setValue(`fields.${index}.type`, newValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      register(`fields.${index}.fromFrame`);
    },
    [register, setValue],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over || active.id === over.id) return;

      const oldSortedIndex = sortedFields.findIndex(
        (field) => field.id === active.id,
      );
      const newSortedIndex = sortedFields.findIndex(
        (field) => field.id === over.id,
      );

      if (oldSortedIndex !== -1 && newSortedIndex !== -1) {
        const currentFields = getValues
          ? getValues('fields')
          : control._formValues?.fields || [];

        const sortedCurrentFields = [...currentFields].sort(
          (a: any, b: any) => {
            const orderA =
              a.order !== undefined && a.order !== null ? a.order : 0;
            const orderB =
              b.order !== undefined && b.order !== null ? b.order : 0;
            return orderA - orderB;
          },
        );

        const reorderedFields = arrayMove(
          [...sortedCurrentFields],
          oldSortedIndex,
          newSortedIndex,
        );

        const orderMap = new Map();
        reorderedFields.forEach((field: any, index: number) => {
          orderMap.set(field.id, index);
        });

        const updatedFields = currentFields.map((field: any) => {
          const newOrder = orderMap.get(field.id);
          return newOrder !== undefined ? { ...field, order: newOrder } : field;
        });

        setValue('fields', updatedFields, {
          shouldDirty: true,
          shouldValidate: true,
        });

        const oldField = sortedCurrentFields[oldSortedIndex];
        const newField = sortedCurrentFields[newSortedIndex];
        const oldIndex = currentFields.findIndex(
          (field: any) => field.id === oldField.id,
        );
        const newIndex = currentFields.findIndex(
          (field: any) => field.id === newField.id,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          move(oldIndex, newIndex);
        }
      }
    },
    [fields, sortedFields, move, control, setValue, getValues],
  );

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext items={sortedFields} strategy={rectSortingStrategy}>
          <Flex direction="column" gap="md">
            {sortedFields.map((field, index) => {
              const originalIndex = fields.findIndex(
                (f: any) => f.id === field.id,
              );
              const displayIndex = originalIndex !== -1 ? originalIndex : index;

              return (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  index={displayIndex}
                  fieldtypes={fieldtypes}
                  control={control}
                  register={register}
                  errors={errors}
                  handleTypeChange={handleTypeChange}
                  handleRemoveField={handleRemoveField}
                  setValue={setValue}
                  getValues={getValues}
                />
              );
            })}

            <Box mt="sm">
              <Button
                variant="tertiary"
                type="button"
                size="sm"
                onClick={onAddField}>
                Add Field
              </Button>
            </Box>
          </Flex>
        </SortableContext>
      </DndContext>
    </Box>
  );
};

interface SortableFieldItemProps {
  field: any;
  index: number;
  fieldtypes: any[];
  control: any;
  register: any;
  errors: any;
  handleTypeChange: (
    index: number,
    onChange: (value: any) => void,
    newValue: any,
  ) => void;
  handleRemoveField: (index: number) => void;
  setValue: any;
  getValues: any;
}

const SortableFieldItem = ({
  field,
  index,
  fieldtypes,
  control,
  register,
  errors,
  handleTypeChange,
  handleRemoveField,
  setValue,
  getValues,
}: SortableFieldItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const fieldTypeId = useWatch({
    control,
    name: `fields.${index}.type`,
  });

  const fieldTypeName =
    fieldtypes.find((ft) => ft.value === fieldTypeId)?.label || '';

  const supportsOptions = ['Drop Down', 'Radio Button', 'options'].includes(
    fieldTypeName,
  );

  const isDateField = fieldTypeName === 'Date';

  const values =
    useWatch({
      control,
      name: `fields.${index}.values`,
      defaultValue: [],
    }) || [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddOption = useCallback(() => {
    const newOption = {
      id: `option-${Date.now()}-${Math.random()}`,
      name: '',
    };
    const currentValues = values || [];
    setValue(`fields.${index}.values`, [...currentValues, newOption], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [values, index, setValue]);

  const handleDeleteOption = useCallback(
    (optionId: string) => {
      const currentValues = values || [];
      setValue(
        `fields.${index}.values`,
        currentValues.filter((v: any) => v.id !== optionId),
        { shouldDirty: true, shouldValidate: true },
      );
    },
    [values, index, setValue],
  );

  const handleOptionNameChange = useCallback(
    (optionId: string, newName: string) => {
      const currentValues = values || [];
      setValue(
        `fields.${index}.values`,
        currentValues.map((v: any) =>
          v.id === optionId ? { ...v, name: newName } : v,
        ),
        { shouldDirty: true, shouldValidate: true },
      );
    },
    [values, index, setValue],
  );

  const machineName = useWatch({
    control,
    name: `fields.${index}.machine_name`,
    defaultValue: '',
  });

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const normalizedName = newName.replace(/\s+/g, ' ');

      const autoMachineName = normalizedName
        ? convertToVariableName(normalizedName)
        : '';

      const currentFields = getValues ? getValues('fields') : [];
      const currentField = currentFields[index];

      const previousAutoMachineName = currentField?.name
        ? convertToVariableName(currentField.name)
        : '';
      const wasManuallyEdited =
        currentField?.machine_name &&
        currentField.machine_name !== previousAutoMachineName &&
        previousAutoMachineName !== '';

      const shouldUpdateMachineName =
        normalizedName !== currentField?.name || !wasManuallyEdited;

      setValue(`fields.${index}.name`, normalizedName, {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (shouldUpdateMachineName) {
        setValue(`fields.${index}.machine_name`, autoMachineName, {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
    },
    [index, setValue, getValues],
  );

  const handleMachineNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const sanitizedValue = newValue.toLowerCase().replace(/[^a-z0-9_]/g, '');
      setValue(`fields.${index}.machine_name`, sanitizedValue, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
    [index, setValue],
  );

  return (
    <Box
      ref={setNodeRef}
      style={style}
      border="1px solid"
      borderColor="border"
      borderRadius="sm"
      p="lg"
      bg={isDragging ? 'gray.50' : 'background-primary'}>
      <Flex align="flex-start" gap="md">
        <Box
          {...attributes}
          {...listeners}
          cursor="grab"
          flexShrink={0}
          py="sm"
          mt="xxl"
          style={{ touchAction: 'none' }}>
          <IconFrame color="icon">
            <DragIcon width={20} height={20} />
          </IconFrame>
        </Box>
        <Box flexGrow={1}>
          <Flex align="flex-start" gap="md">
            <Field
              label="Field Name"
              required
              error={errors?.fields?.[index]?.name?.message}>
              <Flex gap="sm" alignItems="center">
                <InputText
                  {...register(`fields.${index}.name`, {
                    required: 'Name is required',
                  })}
                  placeholder="Enter a field name"
                  onChange={handleNameChange}
                />
              </Flex>
            </Field>
            <Box flexGrow={1}>
              <Controller
                control={control}
                name={`fields.${index}.type`}
                rules={{
                  required: 'Field type is required',
                }}
                render={({ field: { name, value, onChange } }) => (
                  <Field
                    label="Field Type"
                    required
                    error={errors?.fields?.[index]?.type?.message}>
                    <Select
                      name={name}
                      value={value || ''}
                      onChange={(newVal) =>
                        handleTypeChange(index, onChange, newVal)
                      }
                      placeholder="Select field type"
                      options={fieldtypes}
                    />
                  </Field>
                )}
              />
            </Box>

            <Flex>
              <Box py="sm" mt="xxl" onClick={() => handleRemoveField(index)}>
                <IconFrame color="icon">
                  <TrashIcon width={24} height={24} />
                </IconFrame>
              </Box>
            </Flex>
          </Flex>
          <Box mt="md">
            <Field
              label="Machine Name"
              hint="Machine-readable identifier for pipeline pattern matching (auto-filled from field name)">
              <InputText
                placeholder="e.g., customer_name, company_address"
                value={machineName || ''}
                onChange={handleMachineNameChange}
              />
            </Field>
          </Box>

          {supportsOptions && (
            <Box mt="md">
              {values && values.length > 0 && (
                <Flex direction="column" gap="sm" mb="sm">
                  {values.map((option: any) => (
                    <Flex
                      key={option.id}
                      align="center"
                      border="1px solid"
                      borderColor={
                        option.name.trim() === '' ? 'error' : 'border'
                      }
                      borderRadius="sm"
                      bg="background-primary"
                      p="sm">
                      <InputText
                        placeholder="Option Name"
                        value={option.name || ''}
                        onChange={(e) =>
                          handleOptionNameChange(option.id, e.target.value)
                        }
                        style={{ flexGrow: 1 }}
                      />
                      <Box
                        ml="sm"
                        cursor="pointer"
                        onClick={() => handleDeleteOption(option.id)}>
                        <IconFrame color="icon">
                          <XIcon size={20} />
                        </IconFrame>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              )}
              <Button
                variant="secondary"
                type="button"
                size="sm"
                onClick={handleAddOption}>
                <Flex align="center" gap="xs">
                  <IconFrame color="icon">
                    <PlusIcon size={16} />
                  </IconFrame>
                  <Text>Add Option</Text>
                </Flex>
              </Button>
            </Box>
          )}

          {isDateField && (
            <Box mt="md">
              <Controller
                control={control}
                name={`fields.${index}.dateFormat`}
                defaultValue="yyyy-MM-dd"
                render={({ field: { name, value, onChange } }) => (
                  <Field
                    label="Date Format"
                    hint="Select the format for date display">
                    <Select
                      name={name}
                      value={value || 'yyyy-MM-dd'}
                      onChange={(newVal) => {
                        onChange(newVal);
                        setValue(`fields.${index}.dateFormat`, newVal, {
                          shouldDirty: true,
                          shouldValidate: false,
                        });
                      }}
                      placeholder="Select date format"
                      options={[
                        {
                          value: 'yyyy-MM-dd',
                          label: 'YYYY-MM-DD (2024-01-15)',
                        },
                        {
                          value: 'MM/dd/yyyy',
                          label: 'MM/DD/YYYY (01/15/2024)',
                        },
                        {
                          value: 'dd/MM/yyyy',
                          label: 'DD/MM/YYYY (15/01/2024)',
                        },
                        {
                          value: 'yyyy/MM/dd',
                          label: 'YYYY/MM/DD (2024/01/15)',
                        },
                        {
                          value: 'dd-MM-yyyy',
                          label: 'DD-MM-YYYY (15-01-2024)',
                        },
                        {
                          value: 'MM-dd-yyyy',
                          label: 'MM-DD-YYYY (01-15-2024)',
                        },
                        {
                          value: 'MMMM, dd, yyyy',
                          label: 'MMMM DD, YYYY (May, 14, 2005)',
                        },
                        {
                          value: 'dd MMMM yyyy',
                          label: 'DD MMMM YYYY (14 May 2005)',
                        },
                      ]}
                    />
                  </Field>
                )}
              />
            </Box>
          )}

          <Flex gap="md" mt="md" align="flex-start">
            <Box>
              <Controller
                control={control}
                name={`fields.${index}.required`}
                render={({ field: { name, value, onChange } }) => (
                  <Field label="Required">
                    <Toggle
                      name={name}
                      checked={value || false}
                      onClick={() => {
                        onChange(!value);
                        setValue(`fields.${index}.required`, !value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      size="sm"
                    />
                  </Field>
                )}
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(FieldForm);
