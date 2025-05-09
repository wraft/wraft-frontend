import React, { useEffect, useState } from 'react';
import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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

import AssetForm from 'components/Theme/AssetForm';
import StepsIndicator from 'common/Form/StepsIndicator';
import { Layoutschema, Layout } from 'schemas/layout';
import { fetchAPI, deleteAPI, postAPI, putAPI } from 'utils/models';
import { Asset } from 'utils/types';

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
  assets: any[];
  frame: IFrame;
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
}

export const SLUGITEMS = [
  { value: 'contract', label: 'Contract' },
  { value: 'pletter', label: 'Pletter' },
];

const LayoutForm = ({ setOpen, setRerender, cId = '', step = 0 }: Props) => {
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [formStep, setFormStep] = useState(step);
  const [isDeleteAssets, setDeleteAssets] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutContent>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<Layout>({
    mode: 'onBlur',
    resolver: zodResolver(Layoutschema),
  });

  useEffect(() => {
    deleteAllAsset();
  }, [isDeleteAssets]);

  useEffect(() => {
    const assetsPath =
      assets.length > 0 ? assets.map((asset: Asset) => asset.id).join(',') : '';

    setValue('assets', assetsPath);
  }, [assets]);

  useEffect(() => {
    if (layout) {
      setEdit(true);
      const assetsList: Asset[] = layout.assets;
      console.log('datalayout', layout);

      assetsList.forEach((a: Asset) => {
        addUploads(a);
      });

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height || 40);
      setValue('width', layout?.width || 40);
      setValue('description', layout?.description);
      setValue('engine', layout?.engine);
      setValue('unit', layout?.unit || '');
      setValue('frame', layout?.frame || '');
    }
  }, [layout]);

  useEffect(() => {
    loadEngine();
  }, []);

  useEffect(() => {
    if (cId) {
      loadLayout(cId);
    }
  }, [cId]);

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
      const data: any = await fetchAPI(`layouts/${cid}`);
      setLayout(data.layout);
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  const addUploads = (data: Asset) => {
    setAssets((prev) => [...prev, data]);
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

  const deleteAllAsset = () => {
    if (layout && layout.assets && layout.assets.length > 0) {
      const deletePromises = layout.assets.map((asset) => {
        return deleteAPI(`layouts/${layout.id}/assets/${asset.id}`);
      });
      toast.promise(Promise.all(deletePromises), {
        loading: 'Loading...',
        success: () => {
          setAssets([]);
          return `Successfully deleted all assets`;
        },
        error: () => {
          setAssets([]);
          return `Failed to delete all assets`;
        },
      });
    }
    setAssets([]);
  };

  const nextStep = async () => {
    let isValid = false;

    if (step === 0) {
      isValid = await trigger(['name', 'slug', 'description', 'engine']);
    } else if (step === 1) {
      isValid = await trigger(['assets']);
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
    console.log('log', data);

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('width', data.width);
      formData.append('height', data.height);
      formData.append('unit', data.unit);
      formData.append('slug', data.slug);
      formData.append('engine_id', data.engine.id);
      formData.append('assets', data.assets);
      formData.append('frame_id', data.frame.id);
      // formData.append('screenshot', data.screenshot[0] || null);

      const apiUrl = isEdit ? `layouts/${cId}` : 'layouts';
      const apiMethod = isEdit ? putAPI : postAPI;

      await apiMethod(apiUrl, formData);

      setOpen(false);
      toast.success(
        `Successfully ${isEdit ? 'updated' : 'created'} layout ${data.name}`,
        {
          duration: 1000,
          position: 'top-right',
        },
      );

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

  return (
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
                <Field
                  label="Slug"
                  required
                  hint="Slugs are layout templates used for rendering documents"
                  error={errors?.slug?.message}>
                  <Select {...field} options={SLUGITEMS} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="frame"
              render={({ field: { onChange, name, value } }) => (
                <Field
                  label="Frame"
                  required={false} // Change to required={true} if it should be mandatory
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

            <Box pb="sm" display="none">
              {/* {layout && layout.screenshot && (
                <div>
                  <Image alt="" src={API_HOST + layout.screenshot} />
                </div>
              )} */}
              {/* <Label htmlFor="screenshot">Screenshot</Label> */}
              {/* <Input id="screenshot" type="file" {...register('screenshot')} /> */}
            </Box>
            <DisclosureProvider>
              <Disclosure
              // as={dev}
              // sx={{
              //   border: 'none',
              //   bg: 'none',
              //   cursor: 'pointer',
              //   width: 'fit-content',
              //   color: 'green.700',
              //   '&[aria-expanded="true"]': {
              //     '& svg': {
              //       transform: 'rotate(-180deg)',
              //       transition: 'transform 0.3s ease',
              //     },
              //   },
              //   '&[aria-expanded="false"]': {
              //     '& svg': {
              //       transform: 'rotate(0deg)',
              //       transition: 'transform 0.3s ease',
              //     },
              //   },
              // }}
              >
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
                <Field label="Height" required error={errors?.height?.message}>
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
          <AssetForm
            onUpload={addUploads}
            assets={assets}
            setDeleteAssets={setDeleteAssets}
          />
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
  );
};
export default LayoutForm;
