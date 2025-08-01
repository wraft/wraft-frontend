import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowDownIcon } from '@wraft/icon';
import {
  Button,
  Box,
  Flex,
  Text,
  Field,
  InputText,
  Textarea,
  Select,
  Search,
  Drawer,
} from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import StepsIndicator from 'common/Form/StepsIndicator';
import { Layoutschema, Layout } from 'schemas/layout';
import { fetchAPI, postAPI, putAPI } from 'utils/models';

import LayoutAsset from './LayoutAsset';

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface LayoutContent {
  width: number;
  update_at: string;
  unit: string;
  slug_file: null;
  slug: 'pletter' | 'contract';
  screenshot: null;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  engine: IEngine;
  description: string;
  frame: IFrame | null;
  asset: {
    id: string;
    name: string;
    type: string;
    file?: string;
    inserted_at: string;
    updated_at: string;
  } | null;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | null;
}

export interface IFrame {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  description: string;
}

export interface IEngine {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: null;
}

interface Props {
  setOpen: any;
  setRerender?: any;
  cId?: string;
  step?: number;
  initialMargins?: typeof DEFAULT_MARGINS;
  onMarginsChange?: (margins: typeof DEFAULT_MARGINS) => void;
}

const DEFAULT_MARGINS = {
  top: 2.54,
  right: 2.54,
  bottom: 2.54,
  left: 2.54,
};

export const SLUGITEMS = [
  { value: 'contract', label: 'Contract' },
  { value: 'pletter', label: 'Pletter' },
];

const LayoutForm = ({
  setOpen,
  setRerender,
  cId = '',
  step = 0,
  initialMargins = DEFAULT_MARGINS,
  onMarginsChange,
}: Props) => {
  const [formStep, setFormStep] = useState(step);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutContent>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_isSubmit, setIsSubmit] = useState<boolean>(false);
  const [pdfPreview, setPdfPreview] = useState<any>(null);
  const [_uploadProgress, setUploadProgress] = useState<number>(0);
  const [formMargins, setFormMargins] = useState(initialMargins);
  const dropzoneRef = useRef<any>(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(false);

  const methods = useForm<Layout>({
    mode: 'onBlur',
    resolver: zodResolver(Layoutschema),
    defaultValues: {
      frame: '',
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
  } = methods;

  const files = watch('file');

  useEffect(() => {
    if (files && files.length > 0) {
      if (!pdfPreview || pdfPreview.name !== files[0].name) {
        setIsSubmit((prev: boolean) => !prev);
      }
    }
  }, [files, pdfPreview]);

  useEffect(() => {
    if (cId) {
      loadLayout(cId);
    }
  }, [cId]);

  useEffect(() => {
    loadEngine();
  }, []);

  useEffect(() => {
    if (!isLoadingLayout && !isEdit) {
      setFormMargins(initialMargins);
    }
  }, [initialMargins, isLoadingLayout, isEdit]);

  useEffect(() => {
    if (layout && !isLoadingLayout) {
      setEdit(true);

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height || 40);
      setValue('width', layout?.width || 40);
      setValue('description', layout?.description);
      setValue('engine', layout?.engine);
      setValue('unit', layout?.unit || '');

      if (layout?.frame) {
        setValue('frame', layout.frame);
      } else {
        setValue('frame', '');
      }

      setFormMargins(layout.margin || DEFAULT_MARGINS);

      if (layout.asset) {
        setPdfPreview({
          id: layout.asset.id,
          name: layout.asset.name,
          file: layout.asset.file,
          type: layout.asset.type,
        });
      }
    }
  }, [layout, isLoadingLayout, setValue]);

  const loadEngine = async () => {
    try {
      const data: any = await fetchAPI('engines');

      if (!data?.engines?.length) {
        throw new Error('No engines found');
      }

      const pandocEngine = data.engines.find(
        (engine: any) => engine.name === 'Pandoc',
      );

      if (pandocEngine) {
        setValue('engine', {
          name: pandocEngine?.name,
          id: pandocEngine?.id,
        });
      } else {
        console.warn('Pandoc engine not found');
      }
    } catch (error) {
      console.error('Error loading engines:', error);
    }
  };

  const onSearchEngine = async () => {
    try {
      const response: any = await fetchAPI('engines');

      if (!response || !response.engines) {
        throw new Error('Invalid response structure');
      }

      return response.engines;
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  };

  const loadLayout = async (cid: string) => {
    try {
      setIsLoadingLayout(true);
      console.log('LayoutForm: Loading layout for cid:', cid);

      const data: any = await fetchAPI(`layouts/${cid}`);
      console.log('LayoutForm: Layout data received:', data.layout);

      setLayout(data.layout);
    } catch (error) {
      console.error('LayoutForm: Error loading layout:', error);
      setFormMargins(DEFAULT_MARGINS);
    } finally {
      setIsLoadingLayout(false);
    }
  };

  const onSearchFrames = async () => {
    try {
      const response: any = await fetchAPI('frames');

      if (!response || !response.frames) {
        throw new Error('Invalid response structure');
      }

      return response.frames;
    } catch (error) {
      console.error('Error fetching frames:', error);
      return [];
    }
  };

  const nextStep = async () => {
    let isValid = false;

    if (formStep === 0) {
      isValid = await trigger(['name', 'slug', 'description', 'engine']);
    } else if (formStep === 1) {
      isValid = isEdit || (files && files.length > 0);
    }

    if (isValid) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const goTo = (currentStep: number) => setFormStep(currentStep);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('width', data.width);
      formData.append('height', data.height);
      formData.append('unit', data.unit);
      formData.append('slug', data.slug);
      formData.append('engine_id', data.engine.id);
      formData.append(
        'frame_id',
        data.frame && data.frame.id ? data.frame.id : '',
      );

      let marginsToSend = formMargins;
      if (dropzoneRef.current && dropzoneRef.current.getCurrentMargins) {
        marginsToSend = dropzoneRef.current.getCurrentMargins();
      }

      formData.append('margin[top]', marginsToSend.top.toString());
      formData.append('margin[right]', marginsToSend.right.toString());
      formData.append('margin[bottom]', marginsToSend.bottom.toString());
      formData.append('margin[left]', marginsToSend.left.toString());

      if (files && files.length > 0) {
        formData.append('file', files[0]);
        formData.append('asset_name', files[0].name.replace(/\.[^/.]+$/, ''));
        formData.append('type', 'layout');
      }

      const apiUrl = isEdit ? `layouts/${cId}` : 'layouts';
      const apiMethod = isEdit ? putAPI : postAPI;

      if (onMarginsChange) {
        onMarginsChange(marginsToSend);
      }

      await apiMethod(apiUrl, formData, (progress: number) => {
        setUploadProgress(progress);
      });

      toast.success(
        `Successfully ${isEdit ? 'updated' : 'created'} layout ${data.name}`,
        {
          duration: 1000,
          position: 'top-right',
        },
      );

      setOpen(false);

      if (!isEdit) {
        setRerender((previous: boolean) => !previous);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(
        `Failed to ${isEdit ? 'update' : 'create'} layout ${data.name}: ${error.message}`,
        {
          duration: 1000,
          position: 'top-right',
        },
      );
      setIsLoading(false);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} layout:`, error);
    }
  };

  const resetForm = useCallback(() => {
    if (!cId) {
      setEdit(false);
      setLayout(undefined);
      setPdfPreview(null);
      setFormMargins(DEFAULT_MARGINS);
    }
  }, [cId]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <FormProvider {...methods}>
      <Flex
        as="form"
        h="100vh"
        direction="column"
        onSubmit={handleSubmit(onSubmit)}>
        <Box flexShrink="0">
          <Drawer.Header>
            <Drawer.Title>
              {isEdit ? 'Edit layout' : 'Create new layout'}
            </Drawer.Title>
            <X
              size={20}
              weight="bold"
              cursor="pointer"
              onClick={() => setOpen(false)}
            />
          </Drawer.Header>
          <StepsIndicator
            titles={['Basic Details', 'Set Background']}
            formStep={formStep}
            goTo={goTo}
          />
        </Box>

        <Flex
          flex={1}
          overflowY="auto"
          px="xl"
          py="md"
          direction="column"
          gap="md">
          {formStep === 0 && (
            <>
              <Field label="Name" required error={errors?.name?.message}>
                <InputText
                  {...register('name')}
                  placeholder="Enter a Layout Name"
                />
              </Field>

              <Controller
                control={control}
                name="slug"
                defaultValue="contract"
                render={({ field }) => (
                  <Box mb="xs">
                    <Field
                      label="Slug"
                      required
                      hint="Slugs are layout templates used for rendering documents"
                      error={errors?.slug?.message}>
                      <Select {...field} options={SLUGITEMS} />
                    </Field>
                  </Box>
                )}
              />

              <Controller
                control={control}
                name="frame"
                render={({ field: { onChange, name, value } }) => (
                  <Field
                    label="Frame"
                    required={false}
                    error={errors?.frame?.message}>
                    <Search
                      itemToString={(item: any) => item && item.name}
                      name={name}
                      placeholder="Search and Select a Frame"
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
                      search={onSearchFrames}
                    />
                  </Field>
                )}
              />

              <Field
                label="Description"
                required
                error={errors?.description?.message}>
                <Textarea
                  {...register('description')}
                  placeholder="Enter a description"
                />
              </Field>

              <DisclosureProvider>
                <Disclosure>
                  <Flex align="center">
                    <Text>Advanced</Text>
                    <ArrowDownIcon />
                  </Flex>
                </Disclosure>
                <DisclosureContent>
                  <Controller
                    control={control}
                    name="engine"
                    render={({ field: { onChange, name, value } }) => (
                      <Field
                        label="Engine"
                        required
                        error={errors?.engine?.message}>
                        <Search
                          itemToString={(item: any) => item && item.name}
                          name={name}
                          placeholder="Search and Select a Engine"
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
                          search={onSearchEngine}
                        />
                      </Field>
                    )}
                  />
                </DisclosureContent>
              </DisclosureProvider>

              <Box mt={3}>
                <Flex display="none">
                  <Field label="Width" required error={errors?.width?.message}>
                    <InputText value="40" {...register('width')} />
                  </Field>
                  <Field
                    label="Height"
                    required
                    error={errors?.height?.message}>
                    <InputText value="40" {...register('height')} />
                  </Field>
                  <Field label="Unit" required error={errors?.unit?.message}>
                    <InputText value="cm" {...register('unit')} />
                  </Field>
                </Flex>
              </Box>
            </>
          )}

          {formStep === 1 && (
            <Box>
              <LayoutAsset
                ref={dropzoneRef}
                accept={{
                  'application/pdf': [],
                }}
                setPdfPreview={setPdfPreview}
                pdfPreview={pdfPreview}
                setIsSubmit={setIsSubmit}
                initialMargins={formMargins}
                key={`${cId}-${JSON.stringify(formMargins)}`}
              />
            </Box>
          )}
        </Flex>

        <Flex flexShrink="0" px="xl" py="md" gap="sm">
          {formStep > 0 && (
            <Button
              type="button"
              variant="secondary"
              disabled={formStep === 0}
              onClick={prevStep}>
              Previous
            </Button>
          )}

          {formStep === 0 && <Button onClick={nextStep}>Next</Button>}
          {formStep === 1 && (
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              onClick={() => handleSubmit(onSubmit)}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          )}
        </Flex>
      </Flex>
    </FormProvider>
  );
};

export default LayoutForm;
