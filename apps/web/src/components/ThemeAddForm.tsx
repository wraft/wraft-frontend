import React, { useEffect, useState } from 'react';

import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Input } from 'theme-ui';

import { putAPI, fetchAPI, deleteAPI, postAPI } from '../utils/models';
import { Asset } from '../utils/types';

import AssetForm from './AssetForm';
import Field from './Field';
import FieldColor from './FieldColor';

interface ThemeElement {
  name: string;
  file?: string;
  font?: string;
  assets?: any;
  primary_color: string;
  secondary_color: string;
  body_color: string;
}

type FormValues = {
  edit: string;
  name: string;
  font: string;
  primary_color: string;
  secondary_color: string;
  body_color: string;
};

const ThemeAddForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [assets, setAssets] = useState<Array<Asset>>([]);

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => {
      if (!Array.isArray(prevArray)) {
        console.error('prevArray is not an array:', prevArray);
        return [data]; // or handle this case appropriately
      }
      return [...prevArray, data];
    });
  };

  /**
   * Delete Asset from Theme
   * @param id
   */
  const deleteAsset = (id: string) => {
    const deleteAssetRequest = deleteAPI(`assets/${id}`);

    toast.promise(
      deleteAssetRequest,
      {
        loading: 'Loading',
        success: (data: any) => {
          console.log(data);
          setAssets((prev) => prev.filter((item) => item.id !== data.id));
          return `Successfully deleted `;
        },
        error: (err) => `This just happened: ${err.toString()}`,
      },
      {
        success: {
          duration: 1000,
        },
        error: {
          duration: 1000,
        },
      },
    );
  };

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * On Theme Created
   */
  const onDone = () => {
    toast.success(`${isEdit ? 'Updated' : 'Saved'} Successfully`, {
      duration: 1000,
      position: 'top-right',
    });
    Router.push(`/manage/themes`);
  };

  const onSubmit = (data: any) => {
    let assetsList;

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

    const themeData: any = {
      secondary_color: data?.secondary_color,
      primary_color: data?.primary_color,
      name: data.name,
      font: data.font,
      default_theme: data?.default_theme,
      body_color: data?.body_color,
      assets: assetsList,
    };

    if (data?.edit) {
      putAPI(`themes/${data?.edit}`, themeData).then(() => {
        onDone();
      });
    } else {
      postAPI(`themes`, themeData).then(() => {
        onDone();
      });
    }
  };

  const setContentDetails = (data: any) => {
    const res: any = data;
    // setContent(res);

    if (res && res?.theme) {
      const currTheme: ThemeElement = res?.theme;
      setTheme(currTheme);
      setValue('name', currTheme?.name);
      setValue('font', currTheme?.font || '');
      setValue('body_color', currTheme.body_color || '');
      setValue('primary_color', currTheme.primary_color || '');
      setValue('secondary_color', currTheme.secondary_color || '');
      setAssets(currTheme?.assets);
    }
  };

  /**
   * Entity Loader
   */

  const loadDataDetalis = (id: string) => {
    fetchAPI(`themes/${id}`).then((data: any) => {
      setContentDetails(data);
    });
    return false;
  };

  /**
   * Load Entity details to prefill form
   */

  useEffect(() => {
    if (cId) {
      setIsEdit(true);
      loadDataDetalis(cId);
      setValue('edit', cId);
    }
  }, [cId]);

  /**
   * On Change Color
   */

  const onChangeField = (
    _name: 'primary_color' | 'secondary_color' | 'body_color',
    value: any,
  ) => {
    setValue(_name, value);
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
                  register={register}
                  name="primary_color"
                  label="Primary Color"
                  defaultValue={theme?.primary_color || ''}
                  onChangeColor={(value: string) =>
                    onChangeField('primary_color', value)
                  }
                />
                <FieldColor
                  register={register}
                  name="secondary_color"
                  label="Secondary Color"
                  defaultValue={theme?.secondary_color || ''}
                  onChangeColor={(value: string) =>
                    onChangeField('secondary_color', value)
                  }
                />

                <FieldColor
                  register={register}
                  name="body_color"
                  label="Body Color"
                  defaultValue={theme?.body_color || ''}
                  onChangeColor={(value: string) =>
                    onChangeField('body_color', value)
                  }
                />
              </Box>
            </Box>

            {errors.root?.message && (
              <Text variant="error">This field is required</Text>
            )}
          </Flex>

          {theme?.file && (
            <Box sx={{ p: 3, bg: 'teal.700' }}>
              <Text>{theme?.file}</Text>
            </Box>
          )}
        </Box>
        <Button
          disabled={assets && assets.length < 2}
          variant="buttonPrimary"
          ml={2}>
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
                  borderColor: 'border',
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
                      color: 'red.500',
                      border: 'solid 1px',
                      borderColor: 'red.1000',
                      cursor: 'pointer',
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
export default ThemeAddForm;
