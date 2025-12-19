import React, { useEffect, useState } from 'react';
import {
  Drawer,
  useDrawer,
  Box,
  Flex,
  Button,
  Text,
  InputText,
  Field,
  Select,
} from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import { EditIcon } from '@wraft/icon';
import { XIcon } from '@phosphor-icons/react';

import FieldDate from 'common/FieldDate';
import { convertToVariableName, mapFields, capitalizeFirst } from 'utils';

import { useDocument } from '../DocumentContext';

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  id: string;
  meta?: Record<string, any>;
  name: string;
  description?: string | null;
  field_type?: Record<string, any>;
  value: string;
  order?: number;
  required?: boolean;
  machine_name?: string | null;
}

interface PlaceholderBlockProps {
  fields: any;
  onSaved: any;
  fieldValues?: any;
}

const PlaceholderBlock = ({ fields, onSaved }: PlaceholderBlockProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [mappedFields, setMappedFields] = useState<Array<IFieldType>>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pendingSubmit, setPendingSubmit] = useState<boolean>(false);

  const { editorMode, fieldValues, setFieldValues, onDocumentSubmit } =
    useDocument();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const mobileMenuDrawer = useDrawer();

  useEffect(() => {
    if (pendingSubmit && fieldValues) {
      setPendingSubmit(false);
      onDocumentSubmit();
    }
  }, [fieldValues, pendingSubmit, onDocumentSubmit]);

  const onSubmit = async (data: Record<string, any>) => {
    setSubmitting(true);

    const newMappedFields = mapFields(fields, data);

    setFieldValues((prev: any) => ({ ...prev, ...data }));

    setPendingSubmit(true);

    onSaved(newMappedFields);

    setSubmitting(false);
    closeDrawer();
  };

  useEffect(() => {
    if (fields) {
      if (fieldValues) {
        const newMappedFields = mapFields(fields, fieldValues);
        if (editorMode === 'new') {
          onSaved(newMappedFields);
        }
        setMappedFields(newMappedFields);
      }
    }
  }, [fields, fieldValues]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  // Helper function to get field identifier (machine_name if available, otherwise name)
  const getFieldIdentifier = (field: IFieldType): string => {
    return field.machine_name != null && field.machine_name !== ''
      ? field.machine_name
      : convertToVariableName(field.name);
  };

  return (
    <Box mt="xl">
      {fieldValues && (
        <>
          <Flex justify="space-between">
            <Text fontWeight="500" color="text-secondary">
              Data Fields
            </Text>
            {editorMode !== 'view' && (
              <Box onClick={openDrawer}>
                <EditIcon width={14} className="main-icon" />
              </Box>
            )}
          </Flex>

          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            mt="sm">
            {mappedFields &&
              [...mappedFields]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((x: any) => (
                  <Flex
                    key={x.id}
                    borderBottom="1px solid"
                    borderColor="border"
                    p="md">
                    <Text flex="0 0 60%" fontWeight="heading">
                      {x.field_type?.name === 'Table' ? x.name : x.value}
                    </Text>
                    <Text
                      flex="0 0 40%"
                      color="text-secondary"
                      fontWeight="heading"
                      textTransform="capitalize"
                      textAlign="right">
                      {x.field_type?.name === 'Table' ? 'Table' : x.name}
                    </Text>
                  </Flex>
                ))}
          </Box>
        </>
      )}

      <Drawer
        open={isDrawerOpen}
        store={mobileMenuDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={closeDrawer}>
        <Flex
          as="form"
          h="100vh"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}>
          <Box flexShrink="0">
            <Drawer.Header>
              <Drawer.Title>Placeholder</Drawer.Title>
              <XIcon
                size={20}
                weight="bold"
                cursor="pointer"
                onClick={closeDrawer}
              />
            </Drawer.Header>
          </Box>
          <Box flex={1} overflowY="auto" px="xl" py="md">
            {mappedFields && mappedFields.length > 0 && (
              <Box>
                {[...mappedFields]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((field: IFieldType) => (
                    <Box key={field.id} pb="sm">
                      {field.field_type?.name === 'Date' && (
                        <Controller
                          control={control}
                          name={getFieldIdentifier(field)}
                          defaultValue={field.value || ''}
                          rules={{
                            required: {
                              value: field.required || false,
                              message: `${capitalizeFirst(field.name)} is required`,
                            },
                          }}
                          render={({ field: controllerField, fieldState }) => (
                            <FieldDate
                              name={getFieldIdentifier(field)}
                              label={capitalizeFirst(field.name)}
                              sub="Date"
                              onChange={(value: string) => {
                                controllerField.onChange(value);
                              }}
                              value={controllerField.value}
                              required={field.required || false}
                              dateFormat={
                                (field as any).meta?.dateFormat || 'yyyy-MM-dd'
                              }
                              error={
                                (errors?.[getFieldIdentifier(field)] as any)
                                  ?.message ||
                                fieldState.error?.message ||
                                ''
                              }
                            />
                          )}
                        />
                      )}

                      {field.field_type?.name === 'Table' && null}

                      {field.field_type?.name === 'Drop Down' &&
                        field.meta?.values &&
                        field.meta.values.length > 0 && (
                          <Controller
                            control={control}
                            name={getFieldIdentifier(field)}
                            defaultValue={field.value || ''}
                            rules={{
                              required: {
                                value: field.required || false,
                                message: `${capitalizeFirst(field.name)} is required`,
                              },
                            }}
                            render={({ field: controllerField }) => {
                              const options =
                                field.meta?.values?.map((val: any) => ({
                                  value: val.name,
                                  label: val.name,
                                })) || [];
                              const isRequired = field.required || false;
                              return (
                                <Field
                                  label={capitalizeFirst(field.name)}
                                  {...(isRequired && { required: true })}
                                  error={
                                    ((
                                      errors?.[getFieldIdentifier(field)] as any
                                    )?.message as string) || ''
                                  }>
                                  <Select
                                    options={options}
                                    value={controllerField.value || undefined}
                                    onChange={(selectedValue: any) => {
                                      controllerField.onChange(
                                        selectedValue || '',
                                      );
                                    }}
                                    placeholder={`Select your ${field.name}`}
                                  />
                                </Field>
                              );
                            }}
                          />
                        )}
                      {(field.field_type?.name === 'String' ||
                        field.field_type?.name === 'Text') && (
                        <Field
                          label={capitalizeFirst(field.name)}
                          {...(field.required && { required: true })}
                          error={
                            ((errors?.[getFieldIdentifier(field)] as any)
                              ?.message as string) || ''
                          }>
                          <InputText
                            placeholder={`Enter your ${field.name} ${field.field_type.name}`}
                            defaultValue={field.value}
                            {...register(getFieldIdentifier(field))}
                          />
                        </Field>
                      )}

                      {field.field_type?.name !== 'Date' &&
                        field.field_type?.name !== 'Table' &&
                        field.field_type?.name !== 'Drop Down' &&
                        field.field_type?.name !== 'String' &&
                        field.field_type?.name !== 'Text' && (
                          <Field
                            label={capitalizeFirst(field.name)}
                            {...(field.required && { required: true })}
                            error={
                              ((errors?.[getFieldIdentifier(field)] as any)
                                ?.message as string) || ''
                            }>
                            <InputText
                              placeholder=""
                              defaultValue={field.value}
                              {...register(getFieldIdentifier(field))}
                            />
                          </Field>
                        )}
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
          <Flex flexShrink="0" px="xl" py="md" gap="sm">
            <Button type="submit" disabled={submitting}>
              Update
            </Button>
            <Button variant="secondary" onClick={closeDrawer}>
              Close
            </Button>
          </Flex>
        </Flex>
      </Drawer>
    </Box>
  );
};
export default PlaceholderBlock;
