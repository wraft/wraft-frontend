import React, { useEffect, useState } from 'react';

import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Container,
  Label,
  Input,
  Select,
  Box,
  Flex,
  Button,
  Text,
} from 'theme-ui';
import * as z from 'zod';

import { menuLinks } from '../utils';
import { fetchAPI } from '../utils/models';
import { uuidRegex } from '../utils/regex';
import { Asset, Engine } from '../utils/types';

import AssetForm from './AssetForm';
import Field from './Field';
import FieldText from './FieldText';
import { ArrowDropdown } from './Icons';
import ManageSidebar from './ManageSidebar';

export interface Layouts {
  layout: Layout;
  creator: Creator;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface Layout {
  width: number;
  update_at: string;
  unit: string;
  slug_file: null;
  slug: string;
  screenshot: null;
  name: string;
  inserted_at: string;
  id: string;
  height: number;
  engine: IEngine;
  description: string;
  assets: any[];
}

export interface IEngine {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: null;
}

interface Props {
  setRerender?: any;
  cId?: string;
}

type FormValues = {
  name: string;
  slug: string;
  height: number;
  width: number;
  description: string;
  engine_uuid: string;
  screenshot: any;
  unit: string;
};

const schema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
  slug: z
    .string()
    .refine((value) => value === 'pletter' || value === 'contract', {
      message: 'Value must be either "pletter" or "contract"',
    }),
  description: z
    .string()
    .min(5, { message: 'Minimum 5 characters required' })
    .max(255, { message: 'Maximum 255 characters allowed' }),
  engine_uuid: z.string().refine((value) => uuidRegex.test(value), {
    message: 'Invalid Engine',
  }),
  screenshot: z.any(),
  assets: z.any(),
  height: z.any(),
  width: z.any(),
  unit: z.any(),
});

const LayoutViewForm = ({ cId = '' }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm<FormValues>({ mode: 'all', resolver: zodResolver(schema) });
  const [engines, setEngines] = useState<Array<Engine>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [layout, setLayout] = useState<Layout>();
  const [pdfPreview, setPdfPreview] = useState<string | undefined>(undefined);
  const [isEdit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (assets && assets.length > 0) {
      setPdfPreview(assets[assets.length - 1].file);
    }
  }, [assets]);

  useEffect(() => {
    console.log('🥋🐼', engines);
    if (engines && engines.length > 0) {
      const pandocEngine = engines.find((engine) => engine.name === 'Pandoc');
      pandocEngine && setValue('engine_uuid', pandocEngine?.id);
    }
  }, [engines]);

  useEffect(() => {
    if (layout) {
      setEdit(true);
      const assetsList: Asset[] = layout.assets;

      assetsList.forEach((a: Asset) => {
        addUploads(a);
      });

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height || 40);
      setValue('width', layout?.width || 40);
      setValue('description', layout?.description);
      setValue('engine_uuid', layout?.engine?.id);

      trigger(['name', 'slug', 'description']);
    }
  }, [layout]);

  useEffect(() => {
    loadEngine();
  }, []);

  /**
   * If in edit mode
   * @param data
   */

  useEffect(() => {
    if (cId) {
      loadLayout(cId);
    }
  }, [cId]);

  /**
   * Load all Engines
   * @param token
   */
  const loadEngine = () => {
    fetchAPI('engines').then((data: any) => {
      const res: Engine[] = data.engines;
      setEngines(res);
    });
  };

  /**
   * Load Layout Edit Details
   * @param token
   */
  const loadLayout = (cid: string) => {
    fetchAPI(`layouts/${cid}`).then((data: any) => {
      const res: Layout = data.layout;
      setLayout(res);
    });
  };

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    let assetsPath;

    if (assets.length > 0) {
      const a: any = [];
      assets.forEach((e: any) => {
        a.push(e.id);
      });

      // Remove comma in the end
      assetsPath = a.join(',');
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('width', data.width);
    formData.append('height', data.height);
    formData.append('unit', data.unit);
    formData.append('slug', data.slug);
    formData.append('engine_id', data.engine_uuid);
    formData.append('assets', assetsPath);
    formData.append('screenshot', data.screenshot[0]);
  };

  return (
    <Flex>
      <ManageSidebar items={menuLinks} />
      <Box variant="layout.contentFrame">
        <Box p={4}>
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
              {isEdit ? 'Edit layout' : 'Create new layout'}
            </Text>
            <Container sx={{ px: 4 }}>
              <Box>
                {/* form start */}
                <Box
                  sx={{
                    height: 'calc(100vh - 200px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  as="form"
                  onSubmit={handleSubmit(onSubmit)}>
                  <section>
                    <Box>
                      <AssetForm
                        onUpload={addUploads}
                        pdfPreview={pdfPreview}
                        setPdfPreview={setPdfPreview}
                      />
                    </Box>
                  </section>
                  <Container sx={{ display: 'block', pt: 4 }}>
                    <Flex sx={{ flexDirection: 'column', gap: '28px' }}>
                      <Box>
                        <Field
                          name="name"
                          label="Layout Name"
                          defaultValue="Layout X"
                          register={register}
                          error={errors.name}
                        />
                      </Box>
                      <Box>
                        <Label htmlFor="slug">Slug</Label>
                        <Controller
                          control={control}
                          name="slug"
                          defaultValue="contract"
                          rules={{ required: 'Please select a slug' }}
                          render={({ field }) => (
                            <Select mb={0} {...field}>
                              <option>contract</option>
                              <option>pletter</option>
                            </Select>
                          )}
                        />
                        {errors.slug && (
                          <Text variant="error">{errors.slug.message}</Text>
                        )}
                        <Text as="p" variant="subR" mt={2}>
                          Slugs are layout templates used for rendering
                          documents
                        </Text>
                      </Box>
                      <Box>
                        <FieldText
                          name="description"
                          label="Description"
                          defaultValue=""
                          register={register}
                          error={errors.description}
                        />
                      </Box>
                      <Box pb={3} sx={{ display: 'none' }}>
                        <Label htmlFor="screenshot">Screenshot</Label>
                        <Input
                          id="screenshot"
                          type="file"
                          {...register('screenshot')}
                        />
                      </Box>
                      <DisclosureProvider>
                        <Disclosure
                          as={Box}
                          sx={{
                            border: 'none',
                            bg: 'none',
                            cursor: 'pointer',
                            width: 'fit-content',
                            color: 'green.700',
                            '&[aria-expanded="true"]': {
                              '& svg': {
                                transform: 'rotate(-180deg)',
                                transition: 'transform 0.3s ease',
                              },
                            },
                            '&[aria-expanded="false"]': {
                              '& svg': {
                                transform: 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              },
                            },
                          }}>
                          <Flex sx={{ alignItems: 'center' }}>
                            <Text variant="pM" mr={2}>
                              Advanced
                            </Text>
                            <ArrowDropdown />
                          </Flex>
                        </Disclosure>
                        <DisclosureContent>
                          <Box>
                            <Label htmlFor="engine_uuid">Engine ID</Label>
                            <Controller
                              control={control}
                              name="engine_uuid"
                              rules={{ required: 'Please select a Engine ID' }}
                              render={({ field }) => (
                                <Select {...field}>
                                  {engines &&
                                    engines.length > 0 &&
                                    engines.map((m: any) => (
                                      <option key={m.id} value={m.id}>
                                        {m.name}
                                      </option>
                                    ))}
                                </Select>
                              )}
                            />
                            {errors.engine_uuid && (
                              <Text variant="error">
                                {' '}
                                {errors.engine_uuid.message}
                              </Text>
                            )}
                          </Box>
                        </DisclosureContent>
                      </DisclosureProvider>
                      <Box mt={3}>
                        <Flex sx={{ display: 'none' }}>
                          <Field
                            name="width"
                            label="Width"
                            defaultValue="40"
                            register={register}
                            error={errors.width}
                            mr={2}
                          />
                          <Field
                            name="height"
                            label="Height"
                            defaultValue="40"
                            register={register}
                            error={errors.height}
                            mr={2}
                          />
                          <Field
                            name="unit"
                            label="Unit"
                            defaultValue="cm"
                            register={register}
                            error={errors.unit}
                          />
                        </Flex>
                      </Box>
                    </Flex>
                  </Container>
                  <Box>
                    <Button
                      disabled={!isValid || assets.length < 1}
                      variant="buttonPrimary"
                      type="submit"
                      ml={2}>
                      {isEdit ? 'Update' : 'Create'}
                    </Button>
                  </Box>
                </Box>
              </Box>
              {/* Form End */}
            </Container>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};
export default LayoutViewForm;
