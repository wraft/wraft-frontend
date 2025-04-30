import React, { useCallback } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useThemeUI } from 'theme-ui';
import { Button, Box, Flex, InputText, Field, Select } from '@wraft/ui';
import { Trash } from '@phosphor-icons/react';

const FieldForm = ({ fieldtypes, trigger, control, register, errors }: any) => {
  const themeui = useThemeUI();

  const { fields, append, remove } = useFieldArray({
    name: 'fields',
    control,
  });

  const onAddField = useCallback(async () => {
    const isValid = await trigger(`fields`);

    if (isValid) {
      append({ name: '', type: '', fromFrame: false });
    }
  }, [trigger, append]);

  // Create a stable field removal handler
  const handleRemoveField = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  // Create a stable field type change handler
  const handleTypeChange = useCallback(
    (index: number, onChange: (value: any) => void, newValue: any) => {
      onChange(newValue);
      // Also register fromFrame to make sure it persists
      register(`fields.${index}.fromFrame`);
    },
    [register],
  );

  return (
    <Box>
      <Flex direction="column" gap="sm">
        {fields.map((field, index) => {
          // Convert field to TypeScript-friendly format
          const fieldData = field as any;
          const isFrameField = fieldData.fromFrame;

          return (
            <Flex align="flex-start" gap="md" key={field.id}>
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
                  <Trash
                    color={themeui?.theme?.colors?.gray?.[900]}
                    width={24}
                    height={24}
                  />
                </Box>
              </Flex>
            </Flex>
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
    </Box>
  );
};

export default React.memo(FieldForm);
