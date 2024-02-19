import React, { Fragment, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { CloseIcon } from '@wraft/icon';
// import Checkbox from '@wraft-ui/Checkbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Input, Label } from 'theme-ui';

import { putAPI, fetchAPI, deleteAPI, postAPI } from '../utils/models';
import { Asset } from '../utils/types';
import AssetForm from './AssetForm';
import Field from './Field';
import FieldColor from './FieldColor';
import FontList from './FontList';
import Modal from './Modal';

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

type Props = {
  setIsOpen: (e: any) => void;
  setRerender?: (e: any) => void;
};
const ThemeAddForm = ({ setIsOpen, setRerender }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [loadedAssets, setLoadedAssets] = useState<Array<Asset>>([]);
  const [isFontOpen, setIsFontOpen] = useState<boolean>(false);

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
        duration: 1000,
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
    setIsOpen(false);
    setRerender && setRerender((prev: boolean) => !prev);
  };

  const onSubmit = (data: any) => {
    let assetsList;

    if (assets.length > 0) {
      const a: any = [];
      assets.forEach((e: any) => {
        if (!loadedAssets.some((loadedAsset) => loadedAsset.id === e.id)) {
          a.push(e.id);
        }
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
      font: assets[0]?.name?.match(/(.+?)(?=-|$)/)?.[1], // sets font name from asset
      default_theme: data?.default_theme,
      body_color: data?.body_color,
      assets: assetsList,
    };

    console.log('🍿.....', themeData);

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

    if (res && res?.theme) {
      const currTheme: ThemeElement = res?.theme;
      setTheme(currTheme);
      setValue('name', currTheme?.name);
      setValue('body_color', currTheme.body_color || '');
      setValue('primary_color', currTheme.primary_color || '');
      setValue('secondary_color', currTheme.secondary_color || '');
      setAssets(currTheme?.assets);
      setLoadedAssets(currTheme?.assets);
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
    <Fragment>
      <Flex
        sx={{
          height: '100vh',
          overflow: 'scroll',
          flexDirection: 'column',
        }}>
        <Text
          as={'p'}
          variant="pB"
          sx={{
            p: 4,
          }}>
          {isEdit ? 'Edit theme' : 'Create new theme'}
        </Text>
        <Flex
          sx={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          px={4}>
          <Box mx={0} mb={3}>
            <Flex>
              <Box sx={{ width: '100%' }}>
                <Input type="hidden" {...register('edit')} />
                <Field
                  name="name"
                  label="Name"
                  placeholder="Theme name"
                  register={register}
                  mb={'28px'}
                />
                <Label>Font</Label>
                <FontList assets={assets} onDelete={deleteAsset} />
                <Button
                  mt={3}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFontOpen(true);
                  }}
                  variant="buttonSecondary">
                  <Text variant="pM">
                    {assets.length > 0 ? 'Edit Fonts' : 'Add Fonts'}
                  </Text>
                </Button>
                <Box mt={'28px'}>
                  <Label>Colors</Label>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'neutral.200',
                      borderRadius: 4,
                    }}>
                    <Box
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'neutral.200',
                      }}>
                      <FieldColor
                        register={register}
                        name="primary_color"
                        label="Primary Color"
                        defaultValue={theme?.primary_color || ''}
                        onChangeColor={(value: string) =>
                          onChangeField('primary_color', value)
                        }
                        variant="inside"
                        border="none"
                      />
                    </Box>
                    <Box
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'neutral.200',
                      }}>
                      <FieldColor
                        register={register}
                        name="secondary_color"
                        label="Secondary Color"
                        defaultValue={theme?.secondary_color || ''}
                        onChangeColor={(value: string) =>
                          onChangeField('secondary_color', value)
                        }
                        variant="inside"
                        border="none"
                      />
                    </Box>
                    <Box>
                      <FieldColor
                        register={register}
                        name="body_color"
                        label="Body Color"
                        defaultValue={theme?.body_color || ''}
                        onChangeColor={(value: string) =>
                          onChangeField('body_color', value)
                        }
                        variant="inside"
                        border="none"
                      />
                    </Box>
                  </Flex>
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
          <Box pb={4}>
            <Button
              disabled={(assets && assets.length < 2) || !isValid}
              variant="buttonPrimary"
              type="submit"
              ml={2}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Modal isOpen={isFontOpen} onClose={() => setIsFontOpen(false)}>
        <Box sx={{ width: '518px', borderRadius: '8px', p: 4, bg: 'white' }}>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Text variant="pB">Upload font</Text>
            <Button
              variant="base"
              sx={{ p: 0, m: 0 }}
              onClick={(e) => {
                e.preventDefault();
                setIsFontOpen(false);
              }}>
              <CloseIcon color="#2C3641" />
            </Button>
          </Flex>
          <AssetForm onUpload={addUploads} filetype="theme" />
        </Box>
      </Modal>
    </Fragment>
  );
};
export default ThemeAddForm;
