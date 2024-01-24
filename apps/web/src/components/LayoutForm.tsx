import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Container,
  Label,
  Input,
  Select,
  Box,
  Flex,
  Button,
  Text,
  Image,
  Link,
} from 'theme-ui';
import * as z from 'zod';

import {
  API_HOST,
  fetchAPI,
  deleteAPI,
  postAPI,
  putAPI,
} from '../utils/models';
import { uuidRegex } from '../utils/regex';
import { Asset, Engine } from '../utils/types';

import AssetForm from './AssetForm';
import Field from './Field';
import FieldText from './FieldText';
import PdfViewer from './PdfViewer';

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
  setOpen: any;
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

const Form = ({ setOpen, setRerender, cId = '' }: Props) => {
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

  // const { accessToken } = useAuth();

  const [isEdit, setEdit] = useState<boolean>(false);

  // useEffect(() => {
  //   if (assets && assets.length > 0) {
  //     assets.forEach((m: Asset) => m.file);
  //   }
  // }, [assets]);

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
      console.log('🔥assets path', a.join(','));
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

    if (isEdit) {
      //update
      putAPI(`layouts/${cId}`, formData)
        .then(() => {
          setOpen(false);
          toast.success(`Updated Layout ${data.name}`, {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch((error) => {
          toast.error(`Failed to Updated Layout ${data.name} ${error}`, {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      //create
      postAPI(`layouts`, formData)
        .then(() => {
          setRerender((prev: boolean) => !prev);
          setOpen(false);
          toast.success(`Updated Layout ${data.name}`, {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error(`Failed to Updated Layout ${data.name}`, {
            duration: 1000,
            position: 'top-right',
          });
        });
    }
  };

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

  useEffect(() => {
    if (layout) {
      setEdit(true);
      const assetsList: Asset[] = layout.assets;

      assetsList.forEach((a: Asset) => {
        addUploads(a);
      });

      setValue('name', layout.name);
      setValue('slug', layout.slug);
      setValue('height', layout.height);
      setValue('width', layout?.width);
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
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  const deleteAsset = (lid: string, id: string) => {
    const indexOf = assets.findIndex((e) => e.id === id);
    assets.splice(indexOf, 1);
    setAssets(assets.splice(indexOf, 1));
    if (layout?.assets.some((asset) => asset.id === id)) {
      deleteAPI(`layouts/${lid}/assets/${id}`)
        .then(() => {
          toast.success('Deleted Asset', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error('Delete Asset Failed', {
            duration: 1000,
            position: 'top-right',
          });
        });
    }
  };

  const [formStep, setFormStep] = useState(0);
  function next() {
    setFormStep((i) => i + 1);
  }
  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const styleEl = formStep !== 0 ? { display: 'none' } : { display: 'block' };

  return (
    <Flex
      sx={{
        // pb: '44px',
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
      <StepsIndicator
        titles={['Basic Details', 'Set Background']}
        formStep={formStep}
        goTo={goTo}
      />
      <Container sx={{ styleEl, px: 4 }}>
        <Box>
          {formStep >= 1 && (
            <section>
              <Box>
                <Box
                  pt={3}
                  sx={{
                    maxHeight: '400px',
                    overflow: 'scroll',
                    objectFit: 'contain',
                  }}>
                  {assets &&
                    assets.length > 0 &&
                    assets.map((m: Asset) => (
                      <Box
                        key={m.id}
                        sx={{
                          border: 'solid 1px',
                          borderColor: 'border',
                          bg: 'base',
                        }}>
                        <Box
                          sx={{
                            mt: 4,
                            border: 'solid 1px',
                            borderColor: 'border',
                          }}>
                          <Box
                            sx={{
                              overflow: 'scroll',
                              maxHeight: '200px',
                              objectFit: 'contain',
                            }}>
                            {m && m.file && (
                              <PdfViewer
                                // url={contents.content.build}
                                url={`${m.file}`}
                                pageNumber={1}
                              />
                            )}
                          </Box>
                        </Box>
                        <Text as="h6" sx={{ fontSize: 1, m: 0, p: 0, mb: 0 }}>
                          {m.name}
                        </Text>
                        <Link target="_blank" href={`${API_HOST}/${m.file}`}>
                          Download
                        </Link>
                        <Box>
                          <Button
                            sx={{
                              fontSize: 1,
                              px: 1,
                              py: 1,
                              bg: 'white',
                              color: 'red.500',
                              border: 'solid 1px',
                              borderColor: 'red.1000',
                            }}
                            onClick={() => deleteAsset(cId, m.id)}>
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                </Box>
                <AssetForm onUpload={addUploads} />
              </Box>
            </section>
          )}

          {/* form start */}
          <Box
            sx={{
              height: 'calc(100vh - 200px)',
              pt: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            as="form"
            onSubmit={handleSubmit(onSubmit)}>
            {formStep >= 0 && (
              <Container
                sx={formStep > 0 ? { display: 'none' } : { display: 'block' }}>
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
                    {layout && layout.screenshot && (
                      <div>
                        <Image alt="" src={API_HOST + layout.screenshot} />
                      </div>
                    )}
                    <Label htmlFor="screenshot">Screenshot</Label>
                    <Input
                      id="screenshot"
                      type="file"
                      {...register('screenshot')}
                    />
                  </Box>
                  <Box>
                    <Label htmlFor="engine_uuid">Engine ID</Label>
                    <Controller
                      control={control}
                      name="engine_uuid"
                      rules={{ required: 'Please select a Engine ID' }}
                      render={({ field }) => (
                        <Select {...field}>
                          <option disabled selected>
                            select an option
                          </option>
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
                      <Text variant="error"> {errors.engine_uuid.message}</Text>
                    )}
                  </Box>
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
            )}
            <Flex>
              {formStep === 0 && (
                <Button
                  disabled={!isValid}
                  type="button"
                  onClick={next}
                  variant="buttonPrimary"
                  sx={{
                    ':disabled': {
                      bg: 'gray.500',
                    },
                  }}>
                  Next
                </Button>
              )}
              {formStep === 1 && (
                <Box>
                  <Button
                    variant="disabled"
                    // variant=""
                    type="button"
                    onClick={prev}
                    sx={{
                      bg: 'neutral.100',
                      color: 'gray.900',
                    }}>
                    <Text as={'p'} variant="pm">
                      Prev
                    </Text>
                  </Button>
                  <Button
                    disabled={!isValid || assets.length < 1}
                    variant="buttonPrimary"
                    type="submit"
                    ml={2}
                    sx={{
                      ':disabled': {
                        bg: 'gray.500',
                      },
                    }}>
                    {isEdit ? 'Update' : 'Create'}
                  </Button>
                </Box>
              )}
            </Flex>
          </Box>
        </Box>
        {/* Form End */}
      </Container>
    </Flex>
  );
};
export default Form;
