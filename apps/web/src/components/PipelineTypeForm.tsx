import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { useImmer } from 'use-immer';
import * as z from 'zod';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';

import { fetchAPI, postAPI, putAPI, deleteAPI } from '../utils/models';
import { hexColorRegex, uuidRegex } from '../utils/regex';
import { ContentType } from '../utils/types';
import Field from './Field';
import { ArrowRightIcon } from '@wraft/icon';

export interface IFieldItem {
  name: string;
  type: string;
}

export interface FieldTypeItem {
  key: string;
  name?: string;
  field_type_id: string;
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

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  setRerender?: (e: any) => void;
}

const Form = ({ step = 0 }: Props) => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useImmer<ContentType | undefined>(undefined);
  const [formStep, setFormStep] = useState(step);
  const [source, setSource] = useState<any>(['Wraft Form', 'CSV']);
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [formField, setFormField] = useState<Array<any>>(['Name', 'Age']);

  console.log(templates, 'templates');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const cId: string = router.query.id as string;

  const loadTemplate = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.data_templates;
        setTemplates(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const isUpdate = cId ? true : false;

  const onSubmit = (data: any) => {
    console.log('onSubmit', data);
  };

  useEffect(() => {
    loadTemplate();
    setValue('color', '#000000');
  }, []);

  function next() {
    setFormStep((i) => i + 1);
  }
  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };
  const titles = ['Details', 'Configure', 'Mapping'];

  return (
    <Flex
      sx={{
        height: '100vh',
        overflow: 'scroll',
        flexDirection: 'column',
      }}>
      <Text
        variant="pB"
        sx={{
          p: 4,
        }}>
        Add Stages
      </Text>
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
            <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
              <Field
                register={register}
                error={errors.name}
                label="Name"
                name="name"
                defaultValue=""
                placeholder="Pipeline Name"
              />
              <Box mt={3}>
                <Label>Source</Label>
                <Select {...register('pipeline_source', { required: true })}>
                  {source &&
                    source.length > 0 &&
                    source.map((m: any) => (
                      <option value={m} key={m}>
                        {m}
                      </option>
                    ))}
                </Select>
              </Box>
              <Box mt={3}>
                <Label>Choose Form</Label>
                <Select {...register('pipeline_form', { required: true })}>
                  {source &&
                    source.length > 0 &&
                    source.map((m: any) => (
                      <option value={m} key={m}>
                        {m}
                      </option>
                    ))}
                </Select>
              </Box>
            </Box>
            <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
              <Box sx={{ display: 'none' }}>
                <Input
                  id="edit"
                  defaultValue={0}
                  hidden={true}
                  {...register('edit', { required: true })}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Label htmlFor="theme_id">Choose a template</Label>
                <Select
                  id="temlate_id"
                  defaultValue=""
                  {...register('template_id', { required: true })}>
                  {!isUpdate && (
                    <option disabled selected>
                      select an option
                    </option>
                  )}
                  {templates &&
                    templates.length > 0 &&
                    templates.map((m: any) => (
                      <option value={m.id} key={m.id}>
                        {m.title}
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
            <Box sx={{ display: formStep === 2 ? 'block' : 'none' }}>
              <Box>
                <Label htmlFor="`fields[${idx}][type]`">Field Name</Label>
                {formField.map((field, index) => (
                  <Box key={field.id}>
                    <Flex sx={{ alignItems: 'center', pb: '2' }}>
                      <Box sx={{ mr: 2 }}>
                        <Field
                          name={`fields.${index}.name`}
                          register={register}
                          defaultValue={(field && field.name) || ''}
                        />
                      </Box>
                      <ArrowRightIcon />
                      <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <Select
                          defaultValue={(field && field.type) || ''}
                          {...register(`fields.${index}.type` as const, {
                            required: true,
                          })}
                          // onChange={() => handleSubmit(onSubmit)()}
                        >
                          <option disabled selected value={''}>
                            select an option
                          </option>
                        </Select>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Flex>

        <Flex mt={'auto'} pt={4} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            <Button
              sx={{
                display: formStep >= 1 ? 'block' : 'none',
              }}
              variant="buttonSecondary"
              type="button"
              onClick={prev}>
              Prev
            </Button>
            <Button
              ml={2}
              sx={{
                display: formStep == 2 ? 'block' : 'none',
              }}
              variant="buttonPrimary"
              type="button">
              Add
            </Button>
            <Button
              ml={2}
              sx={{
                display: formStep !== titles.length - 1 ? 'block' : 'none',
              }}
              type="button"
              onClick={next}
              variant="buttonPrimary">
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Form;
