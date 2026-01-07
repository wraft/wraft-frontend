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
import { XIcon, ArrowLeftIcon } from '@phosphor-icons/react';

import FieldColor from 'common/FieldColor';
import StepsIndicator from 'common/Form/StepsIndicator';
import { IconFrame } from 'common/Atoms';
import { VariantSchema, Variant } from 'schemas/variant';
import { deleteAPI, fetchAPI, postAPI, putAPI } from 'utils/models';
import { ContentType } from 'utils/types';

import FieldEditor from './FieldEditor';

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
  id?: string;
  fromFrame?: boolean;
  smartTableName?: string;
  required?: boolean;
  order?: number;
  machine_name?: string;
  values?: Array<{ id: string; name: string }>;
  validations?: Array<{ validation: any; error_message?: string }>;
}

export interface FieldTypeItem {
  key: string;
  name: string;
  field_type_id: string;
}

const formDefaultValue = {
  fields: [
    {
      name: '',
      type: '',
      fromFrame: false,
      smartTableName: '',
      required: false,
      order: 0,
      machine_name: '',
      values: [],
      validations: [],
    },
  ],
};

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  setRerender?: (e: any) => void;
}

interface FieldMapping {
  variantField: string;
  frameField: string;
}

interface FieldTypeOption {
  value: string;
  label: string;
}

interface FieldMapping {
  variantField: string;
  frameField: string;
  variantFieldId?: string;
  variantFieldName?: string;
  frameFieldName?: string;
}

const TYPES = [
  { value: 'document', label: 'Document' },
  { value: 'contract', label: 'Contract' },
];

const VariantForm = ({ step = 0, setIsOpen, setRerender }: Props) => {
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [formStep, setFormStep] = useState(step);
  const [frameFields, setFrameFields] = useState<any[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [fieldtypes, setFieldtypes] = useState<FieldTypeOption[]>([]);
  const [variantFields, setVariantFields] = useState<any[]>([]);
  const [isFrameSelected, setIsFrameSelected] = useState(false);
  const prevFrameIdRef = React.useRef<string | null>(null);
  const frameFieldsRef = React.useRef<any[]>([]);
  const mappingsRef = React.useRef<FieldMapping[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    unregister,
    getValues,
  } = useForm<Variant>({
    defaultValues: {
      ...formDefaultValue,
      frame_mapping: [],
    },
    shouldUnregister: false,
    resolver: zodResolver(VariantSchema),
    mode: 'onBlur',
  });
  const router = useRouter();

  const contentId: string = router.query.id as string;
  const watchLayout = watch('layout');
  const watchFields = watch('fields') as Array<IFieldItem>;

  function isLayoutWithFrameFields(
    layout: any,
  ): layout is { frame: { fields: any[] } } {
    return (
      typeof layout === 'object' &&
      layout !== null &&
      layout.frame?.fields !== undefined
    );
  }
  const updateFormMappings = (mappings: FieldMapping[]) => {
    const currentMappings = getValues('frame_mapping') || [];
    currentMappings.forEach((_, index) => {
      unregister(`frame_mapping.${index}`);
    });

    mappings.forEach((mapping, index) => {
      setValue(`frame_mapping.${index}.frameField`, mapping.frameField);
      setValue(`frame_mapping.${index}.variantField`, mapping.variantField);
    });
  };

  useEffect(() => {
    if (contentId) {
      loadDataDetails(contentId);
    }
  }, [contentId]);

  useEffect(() => {
    loadFieldTypes();
  }, []);

  useEffect(() => {
    if (typeof watchLayout === 'object' && watchLayout?.frame?.fields) {
      const newFrameId = watchLayout.id;

      const frameChanged =
        prevFrameIdRef.current && prevFrameIdRef.current !== newFrameId;
      prevFrameIdRef.current = newFrameId;

      frameFieldsRef.current = watchLayout.frame.fields;
      setFrameFields(frameFieldsRef.current);
      setIsFrameSelected(true);

      if (frameChanged && watchFields) {
        const updatedFields = watchFields.filter(
          (field) => !(field as any).fromFrame,
        );
        setValue('fields', updatedFields);

        setFieldMappings([]);
        mappingsRef.current = [];
        updateFormMappings([]);
      }
      const defaultMappings = frameFieldsRef.current.map((frameField: any) => {
        const matchingVariantField = watchFields?.find(
          (field: any) =>
            field.name.toLowerCase() === frameField.name.toLowerCase(),
        );

        return {
          frameField: frameField.name,
          frameFieldName: frameField.name,
          variantField: matchingVariantField?.name || '',
          variantFieldId: matchingVariantField?.id || '',
          variantFieldName: matchingVariantField?.name || '',
        };
      });

      if (fieldMappings.length === 0 || frameChanged) {
        setFieldMappings(defaultMappings);
        mappingsRef.current = defaultMappings;
        updateFormMappings(defaultMappings);
      }

      defaultMappings.forEach((mapping, index) => {
        setValue(`frame_mapping.${index}.frameField`, mapping.frameField);
        setValue(`frame_mapping.${index}.variantField`, mapping.variantField);
      });

      const existingFieldNames = new Set(
        watchFields.map((field) => field.name.toLowerCase()),
      );
      const frameFieldsToAdd = frameFieldsRef.current
        .filter(
          (frameField: any) =>
            !existingFieldNames.has(frameField.name.toLowerCase()),
        )
        .map((frameField: any) => ({
          name: frameField.name,
          type: fieldtypes.length > 0 ? fieldtypes[0].value : '',
          fromFrame: true,
        }));

      if (frameFieldsToAdd.length > 0) {
        const updatedFields = frameChanged
          ? frameFieldsToAdd
          : [...watchFields, ...frameFieldsToAdd];
        setValue('fields', updatedFields);
      }
    } else {
      if (watchFields) {
        const updatedFields = watchFields.filter(
          (field) => !(field as any).fromFrame,
        );
        setValue(
          'fields',
          updatedFields.length
            ? updatedFields
            : [{ name: '', type: '', fromFrame: false }],
        );
      }

      setFrameFields([]);
      setFieldMappings([]);
      updateFormMappings([]);
      setIsFrameSelected(false);
    }
  }, [
    typeof watchLayout === 'object' ? watchLayout?.id : watchLayout,
    watchFields ? watchFields.length : 0,
    fieldtypes.length > 0 ? fieldtypes[0].value : '',
    setValue,
  ]);

  useEffect(() => {
    if (watchFields) {
      const updatedVariantFields = watchFields.map((field: any) => ({
        id: field.id,
        name: field.name,
      }));
      setVariantFields(updatedVariantFields);

      const updatedMappings = fieldMappings.map((mapping) => {
        const matchingField = updatedVariantFields.find(
          (field) => field.name === mapping.variantField,
        );
        return {
          ...mapping,
          variantFieldId: matchingField?.id || mapping.variantFieldId,
        };
      });
      setFieldMappings(updatedMappings);
    }
  }, [watchFields]);

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
        const fields = res.content_type.fields
          .map((item: any, index: number) => {
            const hasRequiredValidation =
              item.validations?.some(
                (v: any) =>
                  v.validation?.rule === 'required' || v.rule === 'required',
              ) || false;

            const isDateField = item.field_type?.name === 'Date';

            return {
              ...item,
              type: item.field_type.id,
              fromFrame: false,
              defaultValue: item.meta?.defaultValue || undefined,
              smartTableName: item.meta?.smartTableName || '',
              dateFormat: isDateField
                ? item.meta?.dateFormat || 'yyyy-MM-dd'
                : undefined,
              required:
                item.required !== undefined
                  ? item.required
                  : hasRequiredValidation,
              order:
                item.order !== undefined && item.order !== null
                  ? item.order
                  : index,
              machine_name: item.machine_name || undefined,
              values: item.meta?.values || [],
              validations: item.validations || [],
            };
          })
          .sort((a: any, b: any) => {
            const orderA =
              a.order !== undefined && a.order !== null ? a.order : 0;
            const orderB =
              b.order !== undefined && b.order !== null ? b.order : 0;
            return orderA - orderB;
          });
        setValue('fields', fields);

        const variantFieldList = fields.map((field: any) => ({
          id: field.id,
          name: field.name,
        }));
        setVariantFields(variantFieldList);
      }
      if (res.content_type?.frame_mapping) {
        const initialMappings = res.content_type.frame_mapping.map(
          (mapping: any) => ({
            frameField: mapping.destination,
            frameFieldName: mapping.destination,
            variantField: mapping.source,
            variantFieldName: mapping.source,
            variantFieldId: '',
          }),
        );

        setFieldMappings(initialMappings);
        mappingsRef.current = initialMappings;
        updateFormMappings(initialMappings);
      }

      if (res.content_type?.fields.length === 0) {
        setValue('fields', [
          {
            name: '',
            type: '',
            fromFrame: false,
            smartTableName: '',
            required: false,
            order: 0,
            machine_name: '',
            values: [],
            validations: [],
          },
        ]);
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

  const onSearchLayouts = async (name: string) => {
    try {
      const params = new URLSearchParams();
      params.append('page_size', '20');
      const queryParam = params.toString();
      if (name && name.trim()) {
        params.append('name', name);
      }
      const response: any = await fetchAPI(`layouts?${queryParam}`);

      if (!response || !response.layouts) {
        throw new Error('Invalid response structure');
      }

      return response.layouts;
    } catch (error) {
      console.error('Error fetching layouts:', error);
      return [];
    }
  };

  const onSearchFlows = async (name: string) => {
    try {
      const params = new URLSearchParams();
      params.append('page_size', '20');
      if (name && name.trim()) {
        params.append('name', name);
      }
      const queryParam = params.toString();
      const response: any = await fetchAPI(`flows?${queryParam}`);

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

  const onSearchThemes = async (name: string) => {
    try {
      const params = new URLSearchParams();
      params.append('page_size', '20');
      if (name && name.trim()) {
        params.append('name', name);
      }
      const queryParam = params.toString();
      const response: any = await fetchAPI(`themes?${queryParam}`);

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
      const fieldTypesRemap: FieldTypeOption[] = data?.field_types.map(
        (field: any) => ({
          label: field.name,
          value: field.id,
        }),
      );
      setFieldtypes(fieldTypesRemap);
    });
  };

  const formatFields = (formFields: any) => {
    if (!formFields || formFields.length === 0) return [];

    return formFields.reduce((formattedFields: any, field: any) => {
      const { name, type, fromFrame, required, order } = field;

      const isExistingField = !!(
        field.id &&
        (typeof field.id === 'string' ? field.id.trim() !== '' : true)
      );

      const isFieldNotInContent = isExistingField
        ? true
        : content?.content_type?.fields
          ? content.content_type.fields.every(
              (existingField: any) => existingField.name !== name,
            )
          : true;

      const hasValidName =
        name &&
        typeof name === 'string' &&
        name.trim() !== '' &&
        name !== '0' &&
        isNaN(Number(name));

      const hasValidType =
        type && typeof type === 'string' && type.trim() !== '';

      const isFieldValid = hasValidName && hasValidType && isFieldNotInContent;

      if (isFieldValid) {
        const fieldTypeName =
          fieldtypes.find((ft: any) => ft.value === type)?.label || '';
        const isDateField = fieldTypeName === 'Date';

        const meta: any = {};
        if (field.defaultValue && field.defaultValue.trim() !== '') {
          meta.defaultValue = field.defaultValue.trim();
        }
        if (field.smartTableName && field.smartTableName.trim() !== '') {
          meta.smartTableName = field.smartTableName.trim();
        }
        if (isDateField && field.dateFormat && field.dateFormat.trim() !== '') {
          meta.dateFormat = field.dateFormat.trim();
        }
        if (field.values && field.values.length > 0) {
          meta.values = field.values
            .filter((v: any) => v.name && v.name.trim() !== '')
            .map((v: any) => ({
              id: v.id,
              name: v.name.trim(),
            }));
        }

        const validations: any[] = [];

        if (required) {
          validations.push({
            validation: {
              value: true,
              rule: 'required',
            },
            error_message: "can't be blank",
          });
        }

        if (
          field.validations &&
          Array.isArray(field.validations) &&
          field.validations.length > 0
        ) {
          field.validations.forEach((val: any) => {
            const validationRule = val.validation?.rule || val.rule;
            if (validationRule !== 'required') {
              validations.push({
                validation: val.validation || {
                  rule: val.rule,
                  value: val.value,
                },
                error_message:
                  val.error_message || val.errorMessage || "can't be blank",
              });
            }
          });
        }

        const formattedField: any = {
          name,
          key: name,
          field_type_id: type,
          fromFrame: fromFrame || false,
          required: required || false,
          order: order !== undefined && order !== null ? order : 0,
          validations: validations.length > 0 ? validations : undefined,
          meta: Object.keys(meta).length > 0 ? meta : undefined,
        };

        if (field.machine_name && field.machine_name.trim() !== '') {
          formattedField.machine_name = field.machine_name.trim();
        }

        if (field.id) {
          formattedField.field_id = field.id;
        }

        formattedFields.push(formattedField);
      }

      return formattedFields;
    }, []);
  };

  const onSubmit = async (data: any) => {
    const mappingsPayload = fieldMappings
      .filter((mapping) => mapping.frameField && mapping.variantField)
      .map((mapping) => ({
        source: mapping.variantField,
        destination: mapping.frameFieldName,
      }));

    const currentFields = getValues('fields') || data.fields || [];

    const formattedFields = formatFields(currentFields).map((field: any) => {
      const { fromFrame: _, ...fieldWithoutFromFrame } = field;
      return fieldWithoutFromFrame;
    });

    const payload = {
      name: data?.name?.trim(),
      layout_id: data.layout.id,
      fields: formattedFields,
      description: data.description?.trim(),
      prefix: data.prefix?.trim(),
      type: data.type,
      flow_id: data.flow.id,
      color: data.color?.trim(),
      theme_id: data.theme.id,
      frame_mapping: mappingsPayload,
    };

    try {
      if (contentId) {
        const fieldsToRemove = getFieldsToRemove(data?.fields);
        await deleteFieldsOneByOne(fieldsToRemove);

        const filteredMappings = fieldMappings.filter(
          (mapping) =>
            !fieldsToRemove.includes(mapping.variantFieldId) &&
            data.fields.some(
              (field: any) => field.name === mapping.variantField,
            ),
        );
        setFieldMappings(filteredMappings);

        await putAPI(`content_types/${contentId}`, payload);
      } else {
        await postAPI('content_types', payload);
      }

      setIsOpen && setIsOpen(false);
      setRerender && setRerender((prev: boolean) => !prev);
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
    } catch (err: any) {
      toast.error(
        (err?.errors && JSON.stringify(err?.errors)) || 'Save Failed',
        {
          duration: 3000,
          position: 'top-right',
        },
      );
    }
  };

  const getFieldsToRemove = (currentFields: any) => {
    return content?.content_type?.fields
      .filter(
        (existingField: any) =>
          !currentFields.some(
            (currentField: any) => currentField.name === existingField.name,
          ),
      )
      .map((field: any) => field.id);
  };

  const deleteFieldsOneByOne = async (fieldIds: string[]) => {
    await Promise.all(
      fieldIds.map(async (fieldId) => {
        try {
          await deleteAPI(`content_type/${contentId}/field/${fieldId}`);
        } catch (error) {
          console.error(`Error deleting ID: ${fieldId}`, error);
        }
      }),
    );
  };

  const onChangeFields = (e: any, name: any) => {
    setValue(name, e);
  };

  const goTo = async (formStepNumber: number) => {
    if (formStepNumber > formStep) {
      let isCurrentStepValid = false;

      if (formStep === 0) {
        isCurrentStepValid = await trigger([
          'name',
          'description',
          'prefix',
          'type',
        ]);
      } else if (formStep === 1) {
        isCurrentStepValid = await trigger([
          'layout',
          'flow',
          'theme',
          'color',
        ]);
      } else if (formStep === 2) {
        isCurrentStepValid = await trigger(['fields']);
      } else if (formStep === 3) {
        isCurrentStepValid = await validateMappings();
      }

      if (!isCurrentStepValid) {
        toast.error('Please complete all required fields', {
          duration: 2000,
          position: 'top-right',
        });
        return;
      }

      if (formStepNumber === 3) {
        const layout = watch('layout');
        if (isLayoutWithFrameFields(layout) && layout.frame.fields.length > 0) {
          const frameFieldNames = new Set(
            layout.frame.fields.map((field: any) => field.name.toLowerCase()),
          );

          const fieldsWithSource = watch('fields').map((field: any) => ({
            ...field,
            fromFrame: frameFieldNames.has(field.name.toLowerCase()),
          }));

          setValue('fields', fieldsWithSource);

          const updatedVariantFields = fieldsWithSource.map((field: any) => ({
            id: field.id,
            name: field.name,
          }));
          setVariantFields(updatedVariantFields);

          const currentFieldNames = new Set(
            fieldsWithSource.map((f: any) => f.name),
          );

          const updatedMappings = mappingsRef.current
            .filter((m) => currentFieldNames.has(m.variantField))
            .map((mapping) => {
              const matchingField = fieldsWithSource.find(
                (f: any) => f.name === mapping.variantField,
              );
              return {
                ...mapping,
                variantFieldId: matchingField?.id || mapping.variantFieldId,
              };
            });

          const mappedFrameFields = new Set(
            updatedMappings.map((m) => m.frameField),
          );

          layout.frame.fields.forEach((frameField: any) => {
            if (!mappedFrameFields.has(frameField.name)) {
              const matchingField = fieldsWithSource.find(
                (f: any) =>
                  f.name.toLowerCase() === frameField.name.toLowerCase(),
              );

              updatedMappings.push({
                frameField: frameField.name,
                frameFieldName: frameField.name,
                variantField: matchingField?.name || '',
                variantFieldId: matchingField?.id || '',
                variantFieldName: matchingField?.name || '',
              });
            }
          });

          setFieldMappings(updatedMappings);
          mappingsRef.current = updatedMappings;
          updateFormMappings(updatedMappings);
        }
      }
    }

    if (formStep === 3) {
      const currentMappings = fieldMappings.filter(
        (mapping) => mapping.frameField && mapping.variantField,
      );
      setFieldMappings(currentMappings);
      mappingsRef.current = currentMappings;
      updateFormMappings(currentMappings);
    }

    setFormStep(formStepNumber);
  };

  const showMappingStep = isFrameSelected && frameFields.length > 0;
  const titles = showMappingStep
    ? ['Details', 'Configure', 'Fields', 'Map Properties']
    : ['Details', 'Configure', 'Fields'];

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
    if (formStep === 3) {
      const currentMappings = fieldMappings.filter(
        (mapping) => mapping.frameField && mapping.variantField,
      );
      setFieldMappings(currentMappings);
      mappingsRef.current = currentMappings;
      updateFormMappings(currentMappings);
    }
    setFormStep(formStep - 1);
  };

  const nextStep = async (event: any) => {
    event.preventDefault();
    let isValid = false;

    if (formStep === 0) {
      isValid = await trigger(['name', 'description', 'prefix', 'type']);
    } else if (formStep === 1) {
      isValid = await trigger(['layout', 'flow', 'theme', 'color']);
    } else if (formStep === 2) {
      isValid = await trigger(['fields']);

      if (isValid) {
        const layout = watch('layout');
        if (isLayoutWithFrameFields(layout) && layout.frame.fields.length > 0) {
          const frameFieldNames = new Set(
            layout.frame.fields.map((field: any) => field.name.toLowerCase()),
          );

          const fieldsWithSource = watch('fields').map((field: any) => ({
            ...field,
            fromFrame: frameFieldNames.has(field.name.toLowerCase()),
          }));

          setValue('fields', fieldsWithSource);

          const updatedVariantFields = fieldsWithSource.map((field: any) => ({
            id: field.id,
            name: field.name,
          }));
          setVariantFields(updatedVariantFields);

          const currentFieldNames = new Set(
            fieldsWithSource.map((f: any) => f.name),
          );

          const updatedMappings = mappingsRef.current
            .filter((m) => currentFieldNames.has(m.variantField))
            .map((mapping) => {
              const matchingField = fieldsWithSource.find(
                (f: any) => f.name === mapping.variantField,
              );
              return {
                ...mapping,
                variantFieldId: matchingField?.id || mapping.variantFieldId,
              };
            });

          const mappedFrameFields = new Set(
            updatedMappings.map((m) => m.frameField),
          );

          layout.frame.fields.forEach((frameField: any) => {
            if (!mappedFrameFields.has(frameField.name)) {
              const matchingField = fieldsWithSource.find(
                (f: any) =>
                  f.name.toLowerCase() === frameField.name.toLowerCase(),
              );

              updatedMappings.push({
                frameField: frameField.name,
                frameFieldName: frameField.name,
                variantField: matchingField?.name || '',
                variantFieldId: matchingField?.id || '',
                variantFieldName: matchingField?.name || '',
              });
            }
          });

          setFieldMappings(updatedMappings);
          mappingsRef.current = updatedMappings;
          updateFormMappings(updatedMappings);

          setFormStep(3);
          return;
        }
      }
    } else if (formStep === 3) {
      isValid = await validateMappings();
    }

    if (isValid) {
      setFormStep((prev) => prev + 1);
    }
  };

  const validateMappings = async () => {
    frameFields.forEach((frameField, index) => {
      setValue(`frame_mapping.${index}.frameField`, frameField.name);

      const mapping = fieldMappings.find(
        (m) => m.frameField === frameField.name,
      );
      setValue(
        `frame_mapping.${index}.variantField`,
        mapping?.variantField || '',
      );
    });

    const isValid = await trigger('frame_mapping');

    if (!isValid) {
      toast.error('Please map all frame fields to content fields', {
        duration: 2000,
        position: 'top-right',
      });
      return false;
    }

    const layout = watch('layout');
    if (isLayoutWithFrameFields(layout)) {
      const allMapped = layout.frame.fields.every((frameField) =>
        fieldMappings.some(
          (m) => m.frameField === frameField.name && m.variantField,
        ),
      );

      if (!allMapped) {
        toast.error('Please map all frame fields to content fields', {
          duration: 2000,
          position: 'top-right',
        });
        return false;
      }

      const variantFieldSet = new Set();
      const hasDuplicateMappings = fieldMappings.some((mapping) => {
        if (!mapping.variantField) return false;

        if (variantFieldSet.has(mapping.variantField)) {
          return true;
        }
        variantFieldSet.add(mapping.variantField);
        return false;
      });

      if (hasDuplicateMappings) {
        toast.error('Each content field can only be mapped once', {
          duration: 2000,
          position: 'top-right',
        });
        return false;
      }
    }

    return true;
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      w="630px"
      onSubmit={handleSubmit(onSubmit)}>
      <Box flexShrink="0">
        <Drawer.Header>
          <Drawer.Title>
            {contentId ? 'Update Variant' : 'Create Variant'}
          </Drawer.Title>
          <IconFrame color="icon">
            <XIcon
              size={20}
              cursor="pointer"
              onClick={() => setIsOpen && setIsOpen(false)}
            />
          </IconFrame>
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
                <Box mb="xs">
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
                </Box>
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
                      <Flex justify="space-between">
                        <Text>{item.name}</Text>
                        {item.frame && (
                          <Text bg="green.400" fontSize="xs" px="sm">
                            Frame
                          </Text>
                        )}
                      </Flex>
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
              setValue={setValue}
              getValues={getValues}
            />
          </Box>
        )}

        {formStep === 3 && showMappingStep && (
          <Box>
            <Text mb="md" color="text-secondary">
              Ensure proper mapping of variant fields to the frame field
            </Text>
            {/* <Box mb="md">
              <Flex gap="md" alignItems="center">
                <Box flex={1}>
                  <Text fontWeight="bold" color="grey">
                    Frame Fields
                  </Text>
                </Box>
                <Box flex={1} ml="xl">
                  <Text fontWeight="bold" color="grey">
                    Content Fields
                  </Text>
                </Box>
              </Flex>
            </Box> */}

            {errors.frame_mapping && (
              <Box
                mb="md"
                p="sm"
                bg="red.100"
                color="red.700"
                borderRadius="md">
                <Text>Please select a content field for each frame field</Text>
              </Box>
            )}

            {frameFields.map((frameField, index) => {
              const contentFieldValue =
                fieldMappings.find((m) => m.frameField === frameField.name)
                  ?.variantField || '';

              return (
                <Box key={frameField.name} mb="md">
                  <Flex alignItems="center" gap="sm">
                    <Box
                      flex={1}
                      bg="gray.400"
                      px="md"
                      py="sm"
                      borderRadius="sm">
                      <Text>{frameField.name}</Text>
                    </Box>
                    <IconFrame color="icon">
                      <ArrowLeftIcon size={20} />
                    </IconFrame>

                    <Box flex={1}>
                      <Field
                        error={
                          errors?.frame_mapping?.[index]?.variantField?.message
                        }>
                        <Search
                          itemToString={(item: any) => item && item}
                          name={`frame_mapping.${index}.variantField`}
                          placeholder="Search content field"
                          minChars={0}
                          value={contentFieldValue}
                          onChange={(selectedValue: string) => {
                            const newMappings = [...fieldMappings];
                            const existingIndex = newMappings.findIndex(
                              (m) => m.frameField === frameField.name,
                            );

                            if (existingIndex >= 0) {
                              newMappings[existingIndex] = {
                                frameField: frameField.name,
                                frameFieldName: frameField.name,
                                variantField: selectedValue,
                                variantFieldId: variantFields.find(
                                  (f) => f.name === selectedValue,
                                )?.id,
                                variantFieldName: selectedValue,
                              };
                            } else {
                              newMappings.push({
                                frameField: frameField.name,
                                frameFieldName: frameField.name,
                                variantField: selectedValue,
                                variantFieldId: variantFields.find(
                                  (f) => f.name === selectedValue,
                                )?.id,
                                variantFieldName: selectedValue,
                              });
                            }

                            setFieldMappings(newMappings);
                            setValue(
                              `frame_mapping.${index}.frameField`,
                              frameField.name,
                            );
                            setValue(
                              `frame_mapping.${index}.variantField`,
                              selectedValue,
                            );
                          }}
                          renderItem={(item: string) => (
                            <Box>
                              <Text>{item}</Text>
                            </Box>
                          )}
                          search={() => {
                            return Promise.resolve(
                              watch('fields')?.map((field) => field.name) || [],
                            );
                          }}
                        />
                      </Field>
                    </Box>
                  </Flex>
                </Box>
              );
            })}

            {frameFields.length === 0 && (
              <Text color="text-secondary">
                No frame fields available for mapping
              </Text>
            )}
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

        {formStep < (showMappingStep ? 3 : 2) ? (
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
