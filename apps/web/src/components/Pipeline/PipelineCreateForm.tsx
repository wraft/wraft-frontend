import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Flex,
  Text,
  InputText as Input,
  Field,
  Search,
  Select,
} from '@wraft/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button, Drawer } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import StepsIndicator from 'common/Form/StepsIndicator';
import { safeTextRegex, uuidRegex } from 'utils/regex';
import { fetchAPI, postAPI } from 'utils/models';

interface PipelineCreateFormProps {
  setIsOpen?: (isOpen: boolean) => void;
  setRerender: (value: any) => void;
}

const pipelineSchema = z.object({
  pipelinename: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(120, { message: 'Maximum 120 characters allowed' })
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed'),
  pipeline_source: z.string().min(1, { message: 'Select a Source' }),
  pipeline_form: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Select a Option',
  }),
});

const SOURCETYPES = [{ value: 'wraft_form', label: 'Wraft Form' }];

const PipelineCreateForm = ({
  setIsOpen,
  setRerender,
}: PipelineCreateFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onSubmit', resolver: zodResolver(pipelineSchema) });

  const createPipeline = (data: any) => {
    setIsLoading(true);
    const pipelinePayload = {
      name: data?.pipelinename.trim(),
      api_route: 'client.crm.com',
      source_id: data.pipeline_form,
      source: data.pipeline_source,
    };

    postAPI(`pipelines`, pipelinePayload)
      .then(() => {
        setIsOpen && setIsOpen(false);
        toast.success('Saved Successfully', {
          duration: 2000,
          position: 'top-right',
        });
        setRerender((prev: boolean) => !prev);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          (err?.errors && JSON.stringify(err?.errors)) ||
            JSON.stringify(err) ||
            'Something went wrong',
          {
            duration: 2000,
            position: 'top-right',
          },
        );
      });
  };

  const onSearchForms = async (query: string) => {
    try {
      const response: any = await fetchAPI(
        `forms${query ? `?name=${query}` : ''}`,
      );

      if (!response || !response.forms) {
        throw new Error('Invalid response structure');
      }

      return response.forms;
    } catch (error) {
      console.error('Error fetching form:', error);
      return [];
    }
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(createPipeline)}>
      <Drawer.Header>
        <Drawer.Title>Create Pipeline</Drawer.Title>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      </Drawer.Header>
      <StepsIndicator titles={['Details']} formStep={0} goTo={() => {}} />
      <Box flex={1} overflowY="auto" px="xl" py="md" minWidth="550px">
        <Flex direction="column" gap="md">
          <Field
            label="Pipeline Name"
            required
            error={errors.pipelinename?.message as string}>
            <Input {...register('pipelinename')} placeholder="Pipeline Name" />
          </Field>
          <Box>
            <Controller
              control={control}
              name="pipeline_source"
              render={({ field }) => (
                <Field
                  label="Source"
                  required
                  error={errors.pipeline_source?.message as string}>
                  <Select
                    {...field}
                    options={SOURCETYPES}
                    placeholder="Select Source"
                    required
                  />
                </Field>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="pipeline_form"
              render={({ field: { onChange, name } }) => (
                <Field
                  label="Choose Form"
                  required
                  error={errors?.pipeline_form?.message as string}>
                  <Search
                    itemToString={(item: any) => item && item.name}
                    name={name}
                    placeholder="Select a Form"
                    minChars={0}
                    onChange={(item: any) => {
                      if (!item) {
                        onChange('');
                        return;
                      }
                      onChange(item.id);
                    }}
                    renderItem={(item: any) => (
                      <Box>
                        <Text>{item?.name}</Text>
                      </Box>
                    )}
                    search={onSearchForms}
                  />
                </Field>
              )}
            />
          </Box>
        </Flex>
      </Box>
      <Flex flexShrink="0" px="xl" py="md" gap="sm">
        <Button
          type="button"
          onClick={handleSubmit(createPipeline)}
          variant="primary"
          loading={isLoading}>
          Create
        </Button>
      </Flex>
    </Flex>
  );
};

export default PipelineCreateForm;
