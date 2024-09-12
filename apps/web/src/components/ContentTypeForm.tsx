import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { useImmer } from 'use-immer';
import * as yup from 'yup';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { Button } from '@wraft/ui';

import { fetchAPI, postAPI, putAPI, deleteAPI } from '../utils/models';
import { hexColorRegex, uuidRegex } from '../utils/regex';
import { ContentType } from '../utils/types';
import Field from './Field';
import FieldColor from './FieldColor';
import FieldEditor from './FieldEditor';
import FieldText from './FieldText';
import { IFlow, ICreator } from './FlowList';

export interface IFlowItem {
  flow: IFlow;
  creator: ICreator;
}

// Generated by https://quicktype.io

export interface Layouts {
  total_pages: number;
  total_entries: number;
  page_number: number;
  layouts: Layout[];
}

export interface Layout {
  width: number;
  updated_at: string;
  unit: string;
  slug_file: string;
  slug: string;
  screenshot: string;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  engine: Engine;
  description: string;
}

export interface Engine {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: string;
}

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

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

export interface FieldTypeItem {
  key: string;
  name?: string;
  field_type_id: string;
}

const formModel = {
  layout_id: '',
  name: '',
  description: '',
  prefix: '',
  flow_id: '',
  theme_id: '',
  edit: '',
  color: '',
};

const validationSchema: any = [
  yup.object().shape({
    name: yup
      .string()
      .min(4, 'Minimum 4 characters required')
      .max(20, 'Maximum 20 characters allowed')
      .transform((value) => value.trim())
      .optional(),
    description: yup
      .string()
      .trim()
      .min(5, 'Minimum 5 characters required')
      .optional(),
    prefix: yup
      .string()
      .min(2, 'Minimum 2 characters required')
      .max(6, 'Maximum 6 characters allowed')
      .matches(/^\D*$/, 'Prefix cannot contain numbers')
      .optional(),
  }),
  yup.object().shape({
    layout_id: yup.string().matches(uuidRegex, 'Select Layout').optional(),
    flow_id: yup.string().matches(uuidRegex, 'Invalid Flow').optional(),
    theme_id: yup.string().matches(uuidRegex, 'Invalid Theme').optional(),
    color: yup
      .string()
      .matches(hexColorRegex, 'Invalid hexadecimal color')
      .optional(),
  }),
  yup.object().shape({
    fields: yup.mixed().optional(),
  }),
];

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  setRerender?: (e: any) => void;
}

const Form = ({ step = 0, setIsOpen, setRerender }: Props) => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useImmer<ContentType | undefined>(undefined);
  const [layouts, setLayouts] = useState<Array<ILayout>>([]);
  const [flows, setFlows] = useState<Array<IFlowItem>>([]);
  const [themes, setThemes] = useState<Array<any>>([]);
  const [fieldtypes, setFieldtypes] = useState<Array<FieldType>>([]);
  const [newFields, setNewFields] = useState<any>([]);
  const [formStep, setFormStep] = useState(step);

  const currentValidationSchema = validationSchema[formStep];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues: formModel,
    shouldUnregister: false,
    resolver: yupResolver(currentValidationSchema),
    mode: 'onBlur',
  });
  const router = useRouter();

  const cId: string = router.query.id as string;

  const addField = () => {
    setFields((fields) => {
      // DON'T USE [...spread] to clone the array because it will bring back deleted elements!
      fields = fields || [];
      const outputState: any = fields.slice(0);

      outputState.push('');

      return outputState;
    });
  };

  const [initialFields, setInitialFields] = useState<any>([]);
  useEffect(() => {
    const convertedArray = content?.content_type.fields.map((item: any) => {
      return {
        name: item.name,
        value: item,
      };
    });
    setInitialFields(convertedArray);
    setFields(convertedArray);
  }, [content]);

  const addFieldVal = (val: any) =>
    setFields((fields) => {
      // DON'T USE [...spread] to clone the array because it will bring back deleted elements!
      fields = fields || [];
      const outputState: any = fields.slice(0);
      if (val.name !== undefined || null) {
        outputState.push({ name: val.value.name, value: val.value });

        const newVal = { name: val.value.name, value: val.value.field_type };
        if (newFields !== undefined || null) {
          const newSet = Object.assign(newFields, [newVal]);
          setNewFields(newSet);
        } else setNewFields([newVal]);
      }

      return outputState;
    });

  const removeField = (did: number) =>
    fields &&
    setFields((fields) => {
      const outputState = fields.slice(0);
      deleteField(did, outputState);
      // `delete` removes the element while preserving the indexes.
      delete outputState[did];

      const idToRemove = (fields[did] as { id: string })?.id;
      const popedNewArr = newFields.filter(
        (item: any) => item.id !== idToRemove,
      );
      setNewFields(popedNewArr);

      const final = outputState.filter(Boolean);

      return final;
    });

  const deleteField = (id: number, fields: any) => {
    const deletable = fields[id];
    if (deletable && deletable.value && deletable.value.id) {
      const deletableId = deletable.value.id;
      const contentypeId = content?.content_type.id;

      deleteAPI(`content_type/${contentypeId}/field/${deletableId}`)
        .then(() => {
          if (cId) loadDataDetails(cId);
          toast.success('Deleted Field' + deletableId, {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error('Deleted Field Faile' + deletableId, {
            duration: 1000,
            position: 'top-right',
          });
        });
    }
  };

  const setContentDetails = (data: any) => {
    const res: ContentType = data;
    setContent((draft) => {
      if (draft) {
        Object.assign(draft, res);
      } else {
        return res;
      }
    });
    if (res && res.content_type) {
      setValue('name', res.content_type.name);
      setValue('description', res.content_type?.description);
      setValue('prefix', res.content_type.prefix);
      setValue('layout_id', res.content_type.layout?.id);
      setValue('flow_id', res?.content_type.flow?.flow?.id);
      setValue('theme_id', res.content_type?.theme?.id);
      setValue('edit', res.content_type.id);
      setValue('color', res.content_type.color);
      trigger();
    }
  };

  const loadDataDetails = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      setContentDetails(data);
    });
    return false;
  };

  const loadLayouts = () => {
    fetchAPI('layouts').then((data: any) => {
      const res: ILayout[] = data.layouts;
      setLayouts(res);
    });
  };

  const loadFieldTypes = () => {
    fetchAPI('field_types?page_size=200').then((data: any) => {
      const res: FieldTypeList = data;
      setFieldtypes(res.field_types);
    });
  };

  const loadFlows = () => {
    fetchAPI('flows').then((data: any) => {
      const res: IFlowItem[] = data.flows;
      setFlows(res);
    });
  };

  const loadThemes = () => {
    fetchAPI('themes?page_size=50').then((data: any) => {
      const res: any = data.themes;
      setThemes(res);
    });
  };

  const formatFields = (fields: any) => {
    const fieldsMap: any = [];

    fields &&
      fields.length > 0 &&
      fields.map((item: any) => {
        const fid: string = item && item.value && item.value.field_type.id;
        const it: FieldTypeItem = {
          name: item.name,
          key: item.name,
          field_type_id: fid,
        };

        const notInContent = content?.content_type?.fields
          ? content?.content_type?.fields?.every(
              (field: any) => field.name !== item.name,
            )
          : true;

        if (
          isNaN(Number(item.name)) &&
          item.name !== '0' &&
          item.name !== '' &&
          item.name !== null &&
          item.name !== undefined &&
          notInContent
        ) {
          fieldsMap.push(it);
        }
      });
    return fieldsMap;
  };

  const onSubmit = (data: any) => {
    if (formStep < 2) {
      setFormStep((i) => i + 1);
      return;
    }

    const sampleD = {
      name: data?.name?.trim(),
      layout_id: data.layout_id,
      fields: formatFields(fields),
      description: data?.description?.trim(),
      prefix: data.prefix?.trim(),
      flow_id: data.flow_id,
      color: data?.color?.trim(),
      theme_id: data.theme_id,
    };

    if (cId) {
      putAPI(`content_types/${cId}`, sampleD)
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
      postAPI('content_types', sampleD)
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

  useEffect(() => {
    if (cId) {
      setValue('edit', cId);
      loadDataDetails(cId);
      loadThemes();
    }
  }, [cId]);

  useEffect(() => {
    loadThemes();
  }, []);

  /**
   * When form is submitted from Forms Editor
   * @param fileds
   */
  const onFieldsSave = (fieldsNew: any) => {
    initialFields ? setFields(initialFields) : setFields([]);
    // format and replae existing fields
    fieldsNew?.data?.fields?.forEach((el: any) => {
      const fieldType = fieldtypes.find((f: any) => f.id === el.type);
      const value = { field_type: fieldType, name: el.name };
      const fieldValue = { value: value, name: el.name };
      if (
        initialFields &&
        initialFields.every(
          (initialField: any) => initialField.name !== el.name,
        )
      ) {
        addFieldVal(fieldValue);
      } else if (!initialFields) {
        addFieldVal(fieldValue);
      }
    });
  };

  const onChangeFields = (e: any, name: any) => {
    setValue(name, e);
  };

  useEffect(() => {
    loadLayouts();
    loadFlows();
    loadFieldTypes();
  }, []);

  const goTo = (step: number) => {
    setFormStep(step);
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

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep((i) => i - 1);
      reset({ ...getValues() });
    }
  };

  return (
    <Flex
      sx={{
        height: '100vh',
        overflow: 'scroll',
        flexDirection: 'column',
      }}>
      <StepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
      <Box
        sx={{ height: '100%' }}
        p={4}
        as="form"
        onSubmit={handleSubmit(onSubmit)}>
        <Flex
          sx={{
            flexDirection: 'column',
            height: 'calc(100% - 80px)',
            overflowY: 'auto',
          }}>
          <Box sx={{ flexGrow: 1 }}>
            {formStep === 0 && (
              <Box>
                <Field
                  register={register}
                  error={errors.name}
                  label="Name"
                  name="name"
                  defaultValue=""
                  placeholder="Variant Name"
                />
                <Box mt={3}>
                  <FieldText
                    register={register}
                    label="Description"
                    name="description"
                    placeholder="Something to guide the user here"
                    defaultValue=""
                  />
                  {errors.description && errors.description.message && (
                    <Text variant="error">
                      {errors.description.message as string}
                    </Text>
                  )}
                </Box>
                <Box mt={3}>
                  <Field
                    register={register}
                    error={errors.prefix}
                    label="Prefix"
                    name="prefix"
                    defaultValue=""
                  />
                </Box>
              </Box>
            )}
            {formStep === 1 && (
              <Box>
                <Box>
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
                    <Text variant="error">
                      {errors.color.message as string}
                    </Text>
                  )}
                </Box>
                <Box mt={3}>
                  <Label htmlFor="layout_id">Layout</Label>
                  <Select id="layout_id" {...register('layout_id')}>
                    {!cId && (
                      <option value="" disabled selected>
                        Select an option
                      </option>
                    )}
                    {layouts &&
                      layouts.length > 0 &&
                      layouts.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </Select>
                  {errors.layout_id && errors.layout_id.message && (
                    <Text variant="error">
                      {errors.layout_id.message as string}
                    </Text>
                  )}
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Label htmlFor="flow_id">Flow</Label>
                  <Select
                    id="flow_id"
                    defaultValue=""
                    {...register('flow_id', { required: true })}>
                    {!cId && (
                      <option value="" disabled selected>
                        Select an option
                      </option>
                    )}
                    {flows &&
                      flows.length > 0 &&
                      flows.map((m: any) => (
                        <option value={m.flow.id} key={m.flow.id}>
                          {m.flow.name}
                        </option>
                      ))}
                  </Select>
                  {errors.flow_id && errors.flow_id.message && (
                    <Text variant="error">
                      {errors.flow_id.message as string}
                    </Text>
                  )}
                </Box>

                <Box sx={{ display: 'none' }}>
                  <Input
                    id="edit"
                    defaultValue={0}
                    hidden={true}
                    {...register('edit', { required: true })}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Label htmlFor="theme_id">Themes</Label>
                  <Select
                    id="theme_id"
                    defaultValue=""
                    {...register('theme_id', { required: true })}>
                    {!cId && (
                      <option value="" disabled selected>
                        Select an option
                      </option>
                    )}
                    {themes &&
                      themes.length > 0 &&
                      themes.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </Select>
                  {errors.theme_id && errors.theme_id.message && (
                    <Text variant="error">
                      {errors.theme_id.message as string}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
            {formStep === 2 && (
              <Box>
                <FieldEditor
                  fields={fields}
                  content={content}
                  fieldtypes={fieldtypes}
                  removeField={removeField}
                  addField={addField}
                  onSave={onFieldsSave}
                  trigger={trigger}
                />
              </Box>
            )}
          </Box>
        </Flex>

        <Flex pt={4} sx={{ gap: '8px' }}>
          <Button
            variant="ghost"
            disabled={formStep === 0}
            onClick={handleBack}>
            Back
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            disabled={
              formStep === 2
                ? !isValid ||
                  fields === undefined ||
                  (fields && fields.length < 1)
                : false
            }>
            {formStep === 2 ? (cId ? 'Update' : 'Create') : 'Next'}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Form;
