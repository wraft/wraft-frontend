import React from 'react';
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

  const onAddField = async () => {
    const isValid = await trigger(`fields`);

    if (isValid) {
      append({ name: '', type: '' });
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="sm">
        {fields.map((field, index) => (
          <Flex align="flex-start" gap="md" key={field.id}>
            <Field
              label="Field Name"
              required
              error={errors?.fields?.[index]?.name?.message}>
              <InputText
                {...register(`fields.${index}.name`, {
                  required: 'Name is required',
                })}
                placeholder="Enter a field name"
              />
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
                      value={value}
                      onChange={onChange}
                      placeholder="Select field type"
                      options={fieldtypes}
                    />
                  </Field>
                )}
              />
            </Box>

            <Flex>
              <Box
                py="sm"
                mt="xxl"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}>
                <Trash
                  color={themeui?.theme?.colors?.gray?.[900]}
                  width={24}
                  height={24}
                />
              </Box>
            </Flex>
          </Flex>
        ))}
        {fields?.length > 0 && (
          <Box mt="sm">
            <Button
              variant="tertiary"
              type="button"
              size="sm"
              onClick={onAddField}>
              Add Field
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default FieldForm;
