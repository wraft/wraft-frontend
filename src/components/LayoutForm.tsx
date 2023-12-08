import React, { useEffect, useState } from 'react';
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

import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

import AssetForm from './AssetForm';
import { Asset, Engine } from '../utils/types';
import {
  loadEntity,
  deleteEntity,
  updateEntityFile,
  createEntityFile,
  API_HOST,
} from '../utils/models';

import Field from './Field';
import FieldText from './FieldText';
import PdfViewer from './PdfViewer';
import Error from './Error';
import { TickIcon } from './Icons';
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
}

const Form = ({ setOpen }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<{
    name: string;
    slug: string;
    height: number;
    width: number;
    description: string;
    engine_uuid: string;
    screenshot: any;
    unit: string;
  }>({ mode: 'all' });
  const token = useStoreState((state) => state.auth.token);
  const [engines, setEngines] = useState<Array<Engine>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [layout, setLayout] = useState<Layout>();

  const [isEdit, setEdit] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = (router.query.id as string) || '';
  const { addToast } = useToasts();

  const onImageUploaded = (data: any) => {
    console.log('data', data);
    setOpen(false);
  };
  const onUpdate = (data: any) => {
    console.log('updated', data);
    setOpen(false);
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
      updateEntityFile(`layouts/${cId}`, formData, token, onUpdate);
      addToast(`Updated Layout ${data.name}`, { appearance: 'success' });
    } else {
      createEntityFile(formData, token, 'layouts', onImageUploaded);

      addToast(`Created Layout ${data.name}`, { appearance: 'success' });
    }
  };

  /**
   * on Engine Load Success
   * @param data
   */
  const loadEngineSuccess = (data: any) => {
    const res: Engine[] = data.engines;
    setEngines(res);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadEngine = (token: string) => {
    loadEntity(token, 'engines', loadEngineSuccess);
  };

  /**
   * Load Layout Edit Details
   * @param token
   */
  const loadLayout = (cid: string, token: string) => {
    loadEntity(token, `layouts/${cid}`, loadLayoutSuccess);
  };
  // const loadAssets = (id: string, token: string) => {
  //   loadEntity(token, `assets/${id}`, loadAssetSuccess);
  // };

  const loadLayoutSuccess = (data: any) => {
    const res: Layout = data.layout;
    setLayout(res);
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
    }
  }, [layout]);

  useEffect(() => {
    if (token) {
      loadEngine(token);
    }
  }, [token]);

  /**
   * If in edit mode
   * @param data
   */

  useEffect(() => {
    if (token && cId) {
      loadLayout(cId, token);
    }
  }, [token, cId]);

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  const deleteAsset = (lid: string, id: string) => {
    const indexOf = assets.findIndex((e) => e.id === id);
    setAssets(assets.splice(indexOf, 1));
    if (layout?.assets.some((asset) => asset.id === id)) {
      deleteEntity(`/layouts/${lid}/assets/${id}`, token);
    }

    addToast(`Deleted Asset`, { appearance: 'error' });
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

  const [isAssetValid, setAssetValid] = React.useState(false);

  return (
    <Flex
      sx={{
        p: 4,
        pb: '44px',
        height: '100%',
        flexDirection: 'column',
        gap: '28px',
      }}>
      <Text
        sx={{
          fontSize: 2,
          color: 'gray.8',
          letterSpacing: '-0.2px',
          fontWeight: 700,
        }}>
        {isEdit ? 'Edit layout' : 'Create new layout'}
      </Text>
      <Flex>
        <Flex sx={{ alignItems: 'center' }}>
          {formStep === 0 ? (
            <Flex
              sx={{
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'green.5',
                // bg: transparentize('green.0', 0.4),
                borderRadius: '50%',
              }}>
              <Text sx={{ fontSize: 1, fontWeight: 500 }}>1</Text>
            </Flex>
          ) : (
            <Flex
              sx={{ justifyItems: 'center', alignItems: 'center' }}
              color="green.5">
              <TickIcon fontSize={'24px'} color="inherit" />
            </Flex>
          )}
          <Text
            ml={'10px'}
            onClick={() => goTo(0)}
            sx={{
              fontSize: 2,
              fontWeight: 400,
              color: formStep === 0 ? 'gray.8' : 'green.5',
            }}>
            Basic details
          </Text>
        </Flex>
        <Flex ml={4} sx={{ alignItems: 'center' }}>
          {isAssetValid ? (
            <Flex
              sx={{ justifyItems: 'center', alignItems: 'center' }}
              color="green.5">
              <TickIcon fontSize={'24px'} color="inherit" />
            </Flex>
          ) : (
            <Flex
              sx={{
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                color: formStep === 0 ? 'gray.5' : 'green.5',
                // bg:
                // formStep === 0 ? 'neutral.0' : transparentize('green.0', 0.7),
                borderRadius: '50%',
              }}>
              <Text sx={{ fontSize: 1, fontWeight: 500 }}>2</Text>
            </Flex>
          )}
          <Text
            onClick={() => goTo(1)}
            ml={'10px'}
            sx={{
              fontSize: 2,
              fontWeight: 400,
              color:
                formStep === 0 ? 'gray.5' : isAssetValid ? 'green.5' : 'gray.8',
            }}>
            Set Background
          </Text>
        </Flex>
      </Flex>
      <Container sx={{ styleEl }}>
        <Box>
          {formStep >= 1 && (
            <section>
              <Box>
                <Box pt={3}>
                  {assets &&
                    assets.length > 0 &&
                    assets.map((m: Asset) => (
                      <Box
                        key={m.id}
                        sx={{
                          border: 'solid 1px',
                          borderColor: 'gray.3',
                          bg: 'base',
                        }}>
                        <Box
                          sx={{
                            mt: 4,
                            border: 'solid 1px',
                            borderColor: 'gray.3',
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
                              color: 'red.4',
                              border: 'solid 1px',
                              borderColor: 'red.9',
                            }}
                            onClick={() => deleteAsset(cId, m.id)}>
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                </Box>
                <AssetForm setAsset={setAssetValid} onUpload={addUploads} />
              </Box>
            </section>
          )}

          {/* form start */}
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
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
                    {errors.slug && <Error text={errors.slug.message} />}
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
                        <Image src={API_HOST + layout.screenshot} />
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
                      <Error text={errors.engine_uuid.message} />
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
            <Flex sx={{ position: 'absolute', bottom: '48px' }}>
              {formStep === 0 && (
                <Button
                  disabled={!isValid}
                  type="button"
                  onClick={next}
                  variant="buttonPrimary"
                  sx={{
                    ':disabled': {
                      bg: 'gray.4',
                    },
                  }}>
                  Next
                </Button>
              )}
              {formStep === 1 && (
                <>
                  <Button
                    variant="disabled"
                    // variant=""
                    type="button"
                    onClick={prev}
                    sx={{
                      bg: 'neutral.0',
                      color: 'gray.8',
                    }}>
                    <Text as={'p'} variant="pm">
                      Prev
                    </Text>
                  </Button>
                  <Button
                    // disabled={!isValid || !isAssetValid}
                    variant="buttonPrimary"
                    type="submit"
                    ml={2}
                    sx={{
                      ':disabled': {
                        bg: 'gray.4',
                      },
                    }}>
                    {isEdit ? 'Update' : 'Create'}
                  </Button>
                </>
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
