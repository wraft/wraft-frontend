import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Field,
  Flex,
  InputText,
  Spinner,
  Textarea,
  Text,
  Select,
} from '@wraft/ui';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from '@phosphor-icons/react';

import {
  FormFieldEntry,
  validateFormEntries,
  prepareFormEntrySubmission,
} from 'schemas/pipelineFormEntry';
import { fetchAPI, postAPI } from 'utils/models';

import TableFieldInput, { TableRow } from '../Form/TableFieldInput';

interface PipelineFormEntryProps {
  formId: string;
  pipelineId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Creates a dynamic Zod schema based on form field definitions
 * @param fields - Array of form field entries
 * @returns Zod schema object
 */
const createFormSchema = (fields: FormFieldEntry[]) => {
  const schemaFields: Record<string, z.ZodType<any>> = {};

  fields.forEach((field) => {
    const fieldSchema = field.required
      ? z.string().min(1, { message: 'This field is required' })
      : z.string().optional();

    schemaFields[field.id] = fieldSchema;
  });

  return z.object(schemaFields);
};

const PipelineFormEntry: React.FC<PipelineFormEntryProps> = ({
  formId,
  pipelineId,
  setIsOpen,
}) => {
  const [fields, setFields] = useState<FormFieldEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFieldsLoading, setIsFieldsLoading] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFormSchema(fields)),
  });

  const fetchFormData = async (id: string) => {
    setIsLoading(true);
    setIsFieldsLoading(true);
    try {
      const data = (await fetchAPI(`forms/${id}`)) as any;

      if (formId) {
        setFormName(data.name);
      }

      const formFields = data.fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.field_type.name,
        fieldTypeId: field.field_type.id,
        order: field.order,
        required: field.validations.some(
          (val: any) =>
            val.validation.rule === 'required' && val.validation.value === true,
        ),
        value: field.meta?.defaultValue || '',
        machineName: field.machine_name || undefined,
        smartTableName: field.meta?.smartTableName || undefined,
        tableColumns: field.meta?.tableColumns || undefined,
        defaultValue: field.meta?.defaultValue || undefined,
        values: field.meta?.values || undefined,
      }));

      setFields(formFields);

      const defaultValues: Record<string, string> = {};
      formFields.forEach((field: FormFieldEntry) => {
        defaultValues[field.id] = (field as any).defaultValue || '';
      });

      reset(defaultValues);
    } catch (error) {
      console.error('Error loading form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsLoading(false);
      setIsFieldsLoading(false);
    }
  };

  /**
   * Resets the form to empty values
   */
  const handleClearForm = () => {
    const defaultValues: Record<string, string> = {};
    fields.forEach((field) => {
      defaultValues[field.id] = '';
    });

    reset(defaultValues);
  };

  const handleFormSubmit: SubmitHandler<Record<string, string>> = async (
    formData,
  ) => {
    setIsSubmitting(true);

    const formattedFields = fields.map((field) => ({
      ...field,
      value: formData[field.id] || '',
    }));

    if (!validateFormEntries(formattedFields)) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const payload = prepareFormEntrySubmission(formattedFields);

    if (pipelineId) {
      payload.pipeline_id = pipelineId;
    }

    try {
      await postAPI(`forms/${formId}/entries`, payload);
      toast.success('Submitted Successfully');
      setIsOpen(false);
      handleClearForm();
    } catch (error: any) {
      if (error.errors === 'No mappings found') {
        toast.error('Pipeline configuration incomplete');
        return;
      }

      toast.error(error.message || 'An error occurred', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchFormData(formId);
    }
  }, [formId]);

  if (isLoading) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        style={{ height: '100vh' }}>
        <Spinner size={32} />
      </Flex>
    );
  }

  /**
   * Renders the form fields or a message if no fields are available
   */
  const renderFormContent = () => {
    if (isFieldsLoading) {
      return (
        <Flex alignItems="center" justifyContent="center" py="xl">
          <Spinner size={24} />
          <Text ml="md">Loading form fields...</Text>
        </Flex>
      );
    }

    if (fields.length === 0) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          py="xl"
          direction="column"
          gap="md">
          <Text fontSize="lg">No form fields available</Text>
          <Text color="text-secondary">
            This form has no fields configured.
          </Text>
        </Flex>
      );
    }

    return fields
      .sort((a, b) => a.order - b.order)
      .map((field: FormFieldEntry) => (
        <Box key={field.id} style={{ marginBottom: '16px' }}>
          <Field
            label={field.name}
            required={field.required}
            error={errors[field.id]?.message as string}>
            <>
              {field.type === 'Text' && (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Textarea
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              )}
              {field.type === 'String' && (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => (
                    <InputText
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              )}
              {field.type === 'File Input' && (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => (
                    <InputText
                      type="file"
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              )}
              {field.type === 'Date' && (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => (
                    <InputText
                      type="date"
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              )}
              {field.type === 'Table' && (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TableFieldInput
                      value={controllerField.value}
                      onChange={(tableValue: TableRow[]) => {
                        controllerField.onChange(JSON.stringify(tableValue));
                      }}
                      columns={(field as any).tableColumns}
                      smartTableName={(field as any).smartTableName}
                    />
                  )}
                />
              )}
              {(field.type === 'Drop Down' || field.type === 'Radio Button') &&
                (field as any).values &&
                (field as any).values.length > 0 && (
                  <Controller
                    name={field.id}
                    control={control}
                    render={({ field: controllerField }) => {
                      const options = (field as any).values.map((val: any) => ({
                        value: val.name,
                        label: val.name,
                      }));
                      return (
                        <Select
                          key={`${field.id}-${controllerField.value || 'empty'}-${options.map((o: any) => o.value).join(',')}`}
                          options={options}
                          value={controllerField.value || undefined}
                          onChange={(selectedValue: any) => {
                            controllerField.onChange(selectedValue || '');
                          }}
                          placeholder="Select an option"
                        />
                      );
                    }}
                  />
                )}
            </>
          </Field>
        </Box>
      ));
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(handleFormSubmit)}>
      <Drawer.Header>
        <Drawer.Title>{formName}</Drawer.Title>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          onClick={() => setIsOpen(false)}
        />
      </Drawer.Header>
      <Box flex={1} overflowY="auto" px="xl" py="md">
        {renderFormContent()}
      </Box>

      <Flex gap="md" p="lg">
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
          disabled={isFieldsLoading || fields.length === 0}>
          Run
        </Button>
        <Button
          variant="secondary"
          onClick={handleClearForm}
          disabled={isSubmitting || isFieldsLoading || fields.length === 0}>
          Clear
        </Button>
      </Flex>
    </Flex>
  );
};

export default PipelineFormEntry;
