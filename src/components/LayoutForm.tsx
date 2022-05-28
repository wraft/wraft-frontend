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

import { useForm } from 'react-hook-form';
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

const Form = () => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const [engines, setEngines] = useState<Array<Engine>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [layout, setLayout] = useState<Layout>();

  const [isEdit, setEdit] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;
  // toats
  const { addToast } = useToasts();

  const onImageUploaded = (data: any) => {
    console.log('data', data);
  };
  const onUpdate = (data: any) => {
    console.log('updated', data);
  };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    let assetsPath;
    //
    if (assets.length > 0) {
      let a: any = [];
      assets.forEach((e: any) => {
        a.push(e.id);
      });

      // Remove comma in the end
      assetsPath = a.join(',');
      console.log('assets', a.join(','));
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

  const loadLayoutSuccess = (data: any) => {
    const res: Layout = data.layout;
    setLayout(res);
  };

  useEffect(() => {
    if (layout) {
      setEdit(true);
      // console.log('assets', layout.assets);
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
    console.log('deleting', lid, id);
    deleteEntity(`/layouts/${lid}/assets/${id}`, token);

    addToast(`Deleted Asset`, { appearance: 'error' });

    if (token && cId) {
      loadLayout(cId, token);
    }
  };

  return (
    <Container sx={{ px: 6 }}>
      <Flex>
        <Box py={3} mt={4}>
          <Box mb={3} mr={4} as="form" onSubmit={handleSubmit(onSubmit)}>
            <Box pb={3}>
              <Label htmlFor="name" mb={1}>
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue="Layout X"
                ref={register({ required: true })}
              />
            </Box>
            <Box>
              <FieldText
                name="description"
                label="Description"
                defaultValue=""
                register={register}
              />
            </Box>
            <Box>
              <Field
                name="slug"
                label="Slug"
                defaultValue=""
                register={register}
              />
            </Box>
            <Box pb={3}>
              {layout && layout.screenshot && (
                <div>
                  <Image src={API_HOST + layout.screenshot} />
                </div>
              )}
              <Label htmlFor="screenshot" mb={1}>
                Screenshot
              </Label>
              <Input
                id="screenshot"
                name="screenshot"
                type="file"
                ref={register()}
              />
            </Box>
            <Box>
              <Label htmlFor="engine_uuid" mb={1}>
                Engine ID
              </Label>
              <Select
                id="engine_uuid"
                name="engine_uuid"
                defaultValue="NYC"
                ref={register({ required: true })}
              >
                {engines &&
                  engines.length > 0 &&
                  engines.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box mt={3}>
              <Flex sx={{ display: 'none' }}>
                <Field
                  name="width"
                  label="Width"
                  defaultValue="40"
                  register={register}
                  mr={2}
                />
                <Field
                  name="height"
                  label="Height"
                  defaultValue="40"
                  register={register}
                  mr={2}
                />
                <Field
                  name="unit"
                  label="Unit"
                  defaultValue="cm"
                  register={register}
                />
              </Flex>
            </Box>
            {errors.exampleRequired && <Text>This field is required</Text>}

            <Flex mx={-2} mt={2}>
              <Button type="submit" ml={2}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </Flex>
          </Box>
        </Box>
        <Box pl={4}>
          <Box pt={3}>
            <Text as="h3" mb={2} pb={1}>
              Assets
            </Text>
            {assets &&
              assets.length > 0 &&
              assets.map((m: Asset) => (
                <Box
                  key={m.id}
                  sx={{
                    p: 3,
                    border: 'solid 1px',
                    borderColor: 'gray.3',
                    bg: 'base',
                    mb: 1,
                  }}
                >
                  <Text as="h6" sx={{ fontSize: 1, m: 0, p: 0, mb: 0 }}>
                    {m.name}
                  </Text>
                  {/* <Text as="p" sx={{ overflow: 'scroll', maxWidth: '50%' }}>http://localhost:4000{m.file}</Text> */}
                  <Link target="_blank" href={`http://localhost:4000${m.file}`}>
                    Download
                  </Link>
                  <Box>
                    <Button
                      sx={{
                        fontSize: 1,
                        px: 1,
                        py: 1,
                        ml: 3,
                        bg: 'white',
                        color: 'red.4',
                        border: 'solid 1px',
                        borderColor: 'red.9',
                      }}
                      onClick={() => deleteAsset(cId, m.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>
          <AssetForm onUpload={addUploads} />
        </Box>
      </Flex>
    </Container>
  );
};
export default Form;
