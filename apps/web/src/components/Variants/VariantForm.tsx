import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Button,
  Box,
  Flex,
  Text,
  InputText,
  Field,
  Textarea,
  Search,
  Select,
  Drawer,
} from '@wraft/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';

import FieldColor from 'common/FieldColor';
import StepsIndicator from 'common/Form/StepsIndicator';
import { VariantSchema, Variant } from 'schemas/variant';
import { fetchAPI, postAPI, putAPI } from 'utils/models';
import { ContentType } from 'utils/types';

import FieldEditor from './FieldEditor';

// Generated by https://quicktype.io
export interface FieldTypeList {
  total_pages: number;
  total_entries: number;
  page_number: number;
  field_types: FieldType[];
}

export interface FieldType {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

export interface FieldTypeItem {
  key: string;
  name: string;
  field_type_id: string;
}

const formDefaultValue = {
  fields: [{ name: '', type: '' }],
};

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  setRerender?: (e: any) => void;
}

const TYPES = [
  { value: 'document', label: 'Document' },
  { value: 'contract', label: 'Contract' },
];

const VariantForm = ({ step = 0, setIsOpen, setRerender }: Props) => {
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [fieldtypes, setFieldtypes] = useState([]);
  const [formStep, setFormStep] = useState(step);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<Variant>({
    defaultValues: formDefaultValue,
    shouldUnregister: false,
    resolver: zodResolver(VariantSchema),
    mode: 'onBlur',
  });
  const router = useRouter();

  const contentId: string = router.query.id as string;

  useEffect(() => {
    if (contentId) {
      loadDataDetails(contentId);
    }
  }, [contentId]);

  useEffect(() => {
    loadFieldTypes();
  }, []);

  const setContentDetails = (data: any) => {
    const res: ContentType = data;
    setContent(data);

    if (res && res.content_type) {
      setValue('name', res.content_type.name);
      setValue('description', res.content_type?.description);
      setValue('prefix', res.content_type.prefix);
      setValue('type', res.content_type.type);
      setValue('layout', res.content_type.layout);
      setValue('flow', res?.content_type.flow?.flow);
      setValue('theme', res.content_type?.theme);
      setValue('color', res.content_type.color);

      if (res.content_type?.fields) {
        const fields = res.content_type.fields.map((item: any) => ({
          ...item,
          type: item.field_type.id,
        }));
        setValue('fields', fields);
      }
      if (res.content_type?.fields.length === 0) {
        setValue('fields', [{ name: '', type: '' }]);
      }

      trigger();
    }
  };

  const loadDataDetails = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      setContentDetails(data);
    });
    return false;
  };

  const onSearchLayouts = async () => {
    try {
      const response: any = await fetchAPI('layouts');

      if (!response || !response.layouts) {
        throw new Error('Invalid response structure');
      }

      return response.layouts;
    } catch (error) {
      console.error('Error fetching layouts:', error);
      return [];
    }
  };

  const onSearchFlows = async () => {
    try {
      const response: any = await fetchAPI('flows');

      if (!response || !response.flows) {
        throw new Error('Invalid response structure');
      }

      const flows = await response?.flows.map((item: any) => ({
        ...item.flow,
        creator: item.creator,
      }));

      return flows;
    } catch (error) {
      console.error('Error fetching flow:', error);
      return [];
    }
  };

  const onSearchThemes = async () => {
    try {
      const response: any = await fetchAPI('themes');

      if (!response || !response.themes) {
        throw new Error('Invalid response structure');
      }

      return response.themes;
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  };

  const loadFieldTypes = () => {
    fetchAPI('field_types?page_size=200').then((data: any) => {
      const fieldTypesRemap = data?.field_types.map((field: any) => ({
        label: field.name,
        value: field.id,
      }));
      setFieldtypes(fieldTypesRemap);
    });
  };

  const formatFields = (formFields: any) => {
    if (!formFields || formFields.length === 0) return [];

    return formFields.reduce((formattedFields: any, field: any) => {
      const { name, type } = field;

      const isFieldNotInContent = content?.content_type?.fields
        ? content.content_type.fields.every(
            (existingField: any) => existingField.name !== name,
          )
        : true;

      const isFieldValid =
        isNaN(Number(name)) &&
        name !== '0' &&
        name.trim() !== '' &&
        name !== null &&
        name !== undefined &&
        isFieldNotInContent;

      if (isFieldValid) {
        formattedFields.push({
          name,
          key: name,
          field_type_id: type,
        });
      }

      return formattedFields;
    }, []);
  };

  const onSubmit = (data: any) => {
    const payload = {
      name: data?.name?.trim(),
      layout_id: data.layout.id,
      fields: formatFields(data.fields),
      description: data.description?.trim(),
      prefix: data.prefix?.trim(),
      type: data.type,
      flow_id: data.flow.id,
      color: data.color?.trim(),
      theme_id: data.theme.id,
    };

    if (contentId) {
      putAPI(`content_types/${contentId}`, payload)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender && setRerender((prev: boolean) => !prev);
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error('Save Failed', {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      postAPI('content_types', payload)
        .then(() => {
          setIsOpen && setIsOpen(false);
          setRerender && setRerender((prev: boolean) => !prev);
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch((err) => {
          toast.error(
            (err?.errors && JSON.stringify(err?.errors)) || 'Save Failed',
            {
              duration: 3000,
              position: 'top-right',
            },
          );
        });
    }
  };

  const onChangeFields = (e: any, name: any) => {
    setValue(name, e);
  };

  const goTo = (formStepNumber: number) => {
    setFormStep(formStepNumber);
  };
  const titles = ['Details', 'Configure', 'Fields'];

  const generateRandomColor = (): string => {
    const randomValue = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomValue()}${randomValue()}${randomValue()}`;
  };

  const coloeCode = useMemo(() => {
    return generateRandomColor();
  }, []);

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const nextStep = async () => {
    let isValid = false;

    if (formStep === 0) {
      isValid = await trigger(['name', 'description', 'prefix', 'type']);
    } else if (formStep === 1) {
      isValid = await trigger(['layout', 'flow', 'theme', 'color']);
    } else if (formStep === 2) {
      isValid = await trigger(['fields']);
    }

    if (isValid) {
      setFormStep((prev) => prev + 1);
    }
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(onSubmit)}>
      <Box flexShrink="0">
        <Drawer.Header>
          <Drawer.Title>
            {contentId ? 'Update Variant' : 'Create Variant'}
          </Drawer.Title>
          <X
            size={20}
            weight="bold"
            cursor="pointer"
            onClick={() => setIsOpen && setIsOpen(false)}
          />
        </Drawer.Header>
        <StepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
      </Box>

      <Flex
        direction="column"
        gap="sm"
        overflowY="auto"
        px="xl"
        py="md"
        flex={1}>
        {formStep === 0 && (
          <>
            <Field label="Name" required error={errors?.name?.message}>
              <InputText
                {...register('name')}
                placeholder="Enter a Variant Name"
              />
            </Field>

            <Field
              label="Description"
              required
              error={errors?.description?.message}>
              <Textarea
                {...register('description')}
                placeholder="Enter a description"
              />
            </Field>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Field
                  label="Document Type"
                  required
                  error={errors.type?.message}>
                  <Select
                    {...field}
                    options={TYPES}
                    placeholder="Select Document Type"
                    required
                  />
                </Field>
              )}
            />
            <Field
              label="Prefix"
              required
              error={errors.prefix?.message}
              hint="Enter a unique prefix for identification (e.g., SDM)">
              <InputText {...register('prefix')} placeholder="Enter a prefix" />
            </Field>
          </>
        )}
        {formStep === 1 && (
          <>
            <FieldColor
              register={register}
              label="Color"
              name="color"
              defaultValue={
                (content && content?.content_type.color) || coloeCode
              }
              onChangeColor={onChangeFields}
            />
            {errors.color && errors.color.message && (
              <Text>{errors.color.message as string}</Text>
            )}

            <Controller
              control={control}
              name="layout"
              render={({ field: { onChange, name, value } }) => (
                <Field label="Layout" required error={errors?.layout?.message}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Search and Select a layout templete"
                    minChars={0}
                    value={value}
                    onChange={(item: any) => {
                      if (!item) {
                        onChange('');
                        return;
                      }
                      onChange(item);
                    }}
                    renderItem={(item: any) => (
                      <Box>
                        <Text>{item.name}</Text>
                      </Box>
                    )}
                    search={onSearchLayouts}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="flow"
              render={({ field: { onChange, name, value } }) => (
                <Field label="Flow" required error={errors?.flow?.message}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Search and Select a flow templete"
                    minChars={0}
                    value={value}
                    onChange={(item: any) => {
                      if (!item) {
                        onChange('');
                        return;
                      }
                      onChange(item);
                    }}
                    renderItem={(item: any) => (
                      <Box>
                        <Text>{item?.name}</Text>
                      </Box>
                    )}
                    search={onSearchFlows}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="theme"
              render={({ field: { onChange, name, value } }) => (
                <Field label="Theme" required error={errors?.theme?.message}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Search and Select a theme templete"
                    minChars={0}
                    value={value}
                    onChange={(item: any) => {
                      if (!item) {
                        onChange('');
                        return;
                      }
                      onChange(item);
                    }}
                    renderItem={(item: any) => (
                      <Box>
                        <Text>{item.name}</Text>
                      </Box>
                    )}
                    search={onSearchThemes}
                  />
                </Field>
              )}
            />
          </>
        )}

        {formStep === 2 && (
          <Box>
            <FieldEditor
              control={control}
              register={register}
              fieldtypes={fieldtypes}
              errors={errors}
              trigger={trigger}
            />
          </Box>
        )}
      </Flex>

      <Flex px="xl" py="xl" gap="sm" flexShrink="0">
        {formStep > 0 && (
          <Button
            type="button"
            variant="secondary"
            disabled={formStep === 0}
            onClick={prevStep}>
            Previous
          </Button>
        )}
        {formStep < 2 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit" onClick={() => handleSubmit(onSubmit)}>
            {contentId ? 'Update' : 'Create'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
export default VariantForm;
