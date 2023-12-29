import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';
import Router, { useRouter } from 'next/router';

import { Label, Input, Checkbox } from 'theme-ui';

import { Asset } from '../utils/types';
import Field from './Field';
import {
  createEntity,
  deleteEntity,
  loadEntityDetail,
  updateEntity,
} from '../utils/models';
import FieldColor from './FieldColor';
import AssetForm from './AssetForm';

interface ThemeElement {
  name: string;
  file?: string;
  font?: string;
  assets?: any;
}

const ThemeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { addToast } = useToasts();

  const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [assets, setAssets] = useState<Array<Asset>>([]);

  const token = useStoreState((state) => state.auth.token);

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => [...prevArray, data]);
  };

  /**
   * Delete Asset from Theme
   * @param id
   */
  const deleteAsset = (id: string) => {
    deleteEntity(`/assets/${id}`, token);
    addToast(`Deleting Asset`, { appearance: 'error' });
  };

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * On Theme Created
   */
  const onDone = () => {
    addToast(`${isEdit ? 'Updated' : 'Saved'} Successfully`, {
      appearance: 'success',
    });
    Router.push(`/manage/themes`);
  };

  const onSubmit = (data: any) => {
    // const formData = new FormData();

    let assetsList;
    //
    if (assets.length > 0) {
      const a: any = [];
      assets.forEach((e: any) => {
        a.push(e.id);
      });

      // Remove comma in the end
      // assetsList = a; //a.join(',');
      assetsList = a.join(',');
    }

    console.log('assetsList', assetsList);

    // @TODO - do what ?
    // const stat = 'f67d779f-3b55-4428-99f1-1efe84305f93';

    // only if files's presetn
    // if(data.file?.size > 0) {
    //   formData.append('file', data.file[0]);
    // }

    // const typeScaleValue: any = {
    //   p: 6,
    //   h2: 8,
    //   h1: 10,
    // };

    const themeData: any = {
      // @TODO
      // remove static def, connect with right API
      // typescale: {
      //   p: 6,
      //   h2: 8,
      //   h1: 10,
      // },
      secondary_color: data?.secondary_color,
      primary_color: data?.primary_color,
      name: data.name,
      font: data.font,
      default_theme: data?.default_theme,
      body_color: data?.body_color,
      assets: assetsList,
    };

    if (data?.edit) {
      updateEntity(`themes/${data?.edit}`, themeData, token, onDone);
    } else {
      createEntity(themeData, `themes`, token, onDone);
    }
  };

  const setContentDetails = (data: any) => {
    const res: any = data;
    // setContent(res);

    if (res && res?.theme) {
      const currTheme: ThemeElement = res?.theme;
      setTheme(currTheme);
      setValue('name', currTheme?.name);
      setValue('font', currTheme?.font);
      setAssets(currTheme?.assets);
    }
  };

  /**
   * Entity Loader
   */

  const loadDataDetalis = (id: string, t: string) => {
    const tok = token ? token : t;
    loadEntityDetail(tok, `themes`, id, setContentDetails);
    return false;
  };

  /**
   * Load Entity details to prefill form
   */

  useEffect(() => {
    if (cId) {
      setIsEdit(true);
      loadDataDetalis(cId, token);
      setValue('edit', cId);
    }
  }, [cId, token]);

  /**
   * On Change Color
   */

  const onChangeField = (name: string, value: any) => {
    setValue(name, value);
  };

  return (
    <Flex sx={{ maxWidth: '90ch', margin: 'auto' }}>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        py={3}
        mt={4}
        pr={4}
        sx={{ width: '50ch' }}>
        <Box mx={0} mb={3}>
          <Flex sx={{ width: '90%' }}>
            <Box sx={{ width: '100%' }}>
              <Input type="hidden" {...register('edit')} />
              <Field
                name="name"
                label="Name"
                defaultValue="New Theme"
                register={register}
              />
              <Field
                name="font"
                label="Font"
                defaultValue=""
                register={register}
              />
              <Box>
                <Text>Colors</Text>
                <FieldColor
                  name="primary_color"
                  label="Primary Color"
                  defaultValue="#000"
                  register={register}
                  onChangeColor={(value: string) =>
                    onChangeField('primary_color', value)
                  }
                />
                <FieldColor
                  name="secondary_color"
                  label="Secondary Color"
                  defaultValue="#111"
                  register={register}
                  onChangeColor={(value: string) =>
                    onChangeField('secondary_color', value)
                  }
                />

                <FieldColor
                  name="body_color"
                  label="Body Color"
                  defaultValue="#111"
                  register={register}
                  onChangeColor={(value: string) =>
                    onChangeField('body_color', value)
                  }
                />
              </Box>
              <Box>
                <Label htmlFor="default_theme" mb={1}>
                  Default Theme?
                </Label>
                <Checkbox
                  defaultChecked={true}
                  {...register('default_theme')}
                />
              </Box>
            </Box>

            {errors.exampleRequired && <Text>This field is required</Text>}
          </Flex>

          {theme?.file && (
            <Box sx={{ p: 3, bg: 'teal.6' }}>
              <Text>{theme?.file}</Text>
            </Box>
          )}
        </Box>
        <Button variant="buttonPrimary" ml={2}>
          {isEdit ? 'Update' : 'Create Theme'}
        </Button>
      </Box>
      <Box>
        <Box pt={3}>
          <Text as="h3" mb={2} pb={1}>
            Fonts
          </Text>

          {assets &&
            assets.length > 0 &&
            assets.map((m: any) => (
              <Box
                key={m.id}
                sx={{
                  p: 3,
                  border: 'solid 1px',
                  borderColor: 'gray.3',
                  mb: 1,
                }}>
                <Text as="h6" sx={{ fontSize: 1, m: 0, p: 0, mb: 0 }}>
                  {m.name}
                </Text>
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
                    onClick={() => deleteAsset(m.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
        <AssetForm onUpload={addUploads} filetype="theme" />
      </Box>
    </Flex>
  );
};
export default ThemeForm;
