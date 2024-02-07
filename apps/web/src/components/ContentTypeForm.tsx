import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { useImmer } from 'use-immer';
import * as z from 'zod';

import { fetchAPI, postAPI, putAPI, deleteAPI } from '../utils/models';
import { hexColorRegex, uuidRegex } from '../utils/regex';
import { ContentType } from '../utils/types';

import Field from './Field';
import FieldColor from './FieldColor';
import FieldEditor from './FieldEditor';
import FieldText from './FieldText';
import { IFlow, ICreator } from './FlowList';
import PageHeader from './PageHeader';

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

const schema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
  prefix: z
    .string()
    .min(2, { message: 'Minimum 2 characters required' })
    .max(6, { message: 'Maximum 6 characters allowed' })
    .refine((value) => !/\d/.test(value), {
      message: 'Prefix cannot contain numbers',
    }),
  color: z.string().refine((value) => hexColorRegex.test(value), {
    message: 'Invalid hexadecimal color',
  }),
  description: z.string().min(5, { message: 'Minimum 5 characters required' }),
  fields: z.any(),
  layout_id: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Invalid Layout',
  }),
  flow_id: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Invalid Flow',
  }),
  theme_id: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Invalid Theme',
  }),
  edit: z.any(),
});

const Form = () => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useImmer<ContentType | undefined>(undefined);
  const [layouts, setLayouts] = useState<Array<ILayout>>([]);
  const [flows, setFlows] = useState<Array<IFlowItem>>([]);
  const [themes, setThemes] = useState<Array<any>>([]);
  const [fieldtypes, setFieldtypes] = useState<Array<FieldType>>([]);
  const [newFields, setNewFields] = useState<any>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
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

  const deleteMe = (deletableId: string) => {
    deleteAPI(`content_types/${deletableId}`).then(() => {
      toast.success('Deleted Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      Router.push(`/content-types`);
    });
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
      setValue('layout_id', res.content_type.layout?.id || undefined);
      setValue('flow_id', res.content_type.flow?.flow?.id || undefined);
      setValue('theme_id', res.content_type.theme.id || undefined);
      setValue('edit', res.content_type.id);
      setValue('color', res.content_type.color);
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
          !Number(item.name) &&
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

  /**
   * On Theme Created
   */

  const isUpdate = cId ? true : false;

  const onSubmit = (data: any) => {
    const sampleD = {
      name: data.name,
      layout_id: data.layout_id,
      fields: formatFields(fields),
      description: data.description,
      prefix: data.prefix,
      flow_id: data.flow_id,
      color: data.color,
      theme_id: data.theme_id,
    };

    if (isUpdate) {
      putAPI(`content_types/${data.edit}`, sampleD)
        .then(() => {
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          Router.push(`/content-types`);
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
          toast.success('Saved Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          Router.push(`/content-types`);
        })
        .catch(() => {
          toast.error('Save Failed', {
            duration: 1000,
            position: 'top-right',
          });
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

  const onChangeFields = (_e: any, _name: string) => {
    setValue(_name, _e);
  };

  useEffect(() => {
    loadLayouts();
    loadFlows();
    loadFieldTypes();
  }, []);

  return (
    <Box>
      <PageHeader
        title={`${cId ? 'Edit' : 'New '} Variant`}
        desc="Manage Variants">
        <Box />
      </PageHeader>
      <Flex variant="layout.pageFrame">
        <Flex sx={{ maxWidth: '100ch', mx: `auto`, pb: 5 }}>
          <Box sx={{ minWidth: '60ch' }}>
            <Box mx={0} mb={6} as="form" onSubmit={handleSubmit(onSubmit)}>
              <Flex sx={{ mb: 0 }}>
                <Box sx={{ flexGrow: 1, pb: 3 }}>
                  <Box sx={{ py: 2 }}>
                    <Field
                      fontSize={1}
                      register={register}
                      error={errors.name}
                      label="Name"
                      name="name"
                      defaultValue=""
                      placeholder="Variant Name"
                    />
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <FieldText
                      register={register}
                      label="Description"
                      name="description"
                      defaultValue="Something to guide the user here"
                    />
                    {errors.description && errors.description.message && (
                      <Text variant="error">
                        {errors.description.message as string}
                      </Text>
                    )}
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <Field
                      register={register}
                      error={errors.prefix}
                      label="Prefix"
                      name="prefix"
                      defaultValue=""
                    />
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <FieldColor
                      register={register}
                      label="Color"
                      name="color"
                      defaultValue={
                        (content && content?.content_type.color) || ''
                      }
                      onChangeColor={onChangeFields}
                    />
                    {errors.color && errors.color.message && (
                      <Text variant="error">
                        {errors.color.message as string}
                      </Text>
                    )}
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <Label htmlFor="layout_id" mb={1}>
                      Layout
                    </Label>
                    <Select
                      id="layout_id"
                      {...register('layout_id', { required: true })}>
                      {!isUpdate && (
                        <option disabled selected>
                          select an option
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
                  <Box sx={{ py: 2 }}>
                    <Label htmlFor="flow_id" mb={1}>
                      Flow
                    </Label>
                    <Select
                      id="flow_id"
                      defaultValue=""
                      {...register('flow_id', { required: true })}>
                      {!isUpdate && (
                        <option disabled selected>
                          select an option
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

                  <Box sx={{ py: 2 }}>
                    <Label htmlFor="theme_id" mb={1}>
                      Themes
                    </Label>
                    <Select
                      id="theme_id"
                      defaultValue=""
                      {...register('theme_id', { required: true })}>
                      {!isUpdate && (
                        <option disabled selected>
                          select an option
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
                {errors.exampleRequired && <Text>This field is required</Text>}
              </Flex>

              <Button variant="btnPrimaryLarge">Save</Button>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, width: '340px' }}>
            <FieldEditor
              fields={fields}
              content={content}
              fieldtypes={fieldtypes}
              removeField={removeField}
              addField={addField}
              onSave={onFieldsSave}
            />
            <Box sx={{ mx: 4 }}>
              {cId && (
                <Button
                  type="button"
                  variant="btnPrimaryLarge"
                  onClick={() => deleteMe(cId)}>
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
export default Form;
