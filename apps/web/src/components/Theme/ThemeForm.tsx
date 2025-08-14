import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CloseIcon } from '@wraft/icon';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Drawer,
  Field,
  Flex,
  InputText,
  Label,
  Text,
  Modal,
} from '@wraft/ui';
import { PlusIcon, X } from '@phosphor-icons/react';

import FontList from 'components/Theme/FontList';
import AssetForm from 'components/Theme/AssetForm';
import FieldColor from 'common/FieldColor';
import { putAPI, fetchAPI, deleteAPI, postAPI } from 'utils/models';
import { Asset } from 'utils/types';

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
  onUpdate?: (e: any) => void;
};

const DEFAULT_FORM = {
  body_color: '#FFFFFF',
  primary_color: '#000000',
  secondary_color: '#000000',
};

const ThemeAddForm = ({ setIsOpen, setRerender, onUpdate }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [isFontOpen, setIsFontOpen] = useState<boolean>(false);
  const [loadedAssets, setLoadedAssets] = useState<Array<Asset>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm<FormValues>({ mode: 'onSubmit', defaultValues: DEFAULT_FORM });
  const router = useRouter();
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (cId) {
      setIsEdit(true);
      loadDataDetalis(cId);
    }
  }, [cId]);

  /**
   * Upload Assets
   * @param data
   */
  const addUploads = (data: Asset) => {
    setAssets((prevArray) => {
      if (!Array.isArray(prevArray)) {
        console.error('prevArray is not an array:', prevArray);
        return [data];
      }
      return [...prevArray, data];
    });
  };

  const deleteAsset = async (id: string) => {
    try {
      await deleteAPI(`assets/${id}`);
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete asset: ${error.message}`);
    }
  };

  const onDone = () => {
    // Router.push(`/manage/themes`);
    setIsOpen(false);
    setRerender && setRerender((prev: boolean) => !prev);
  };

  const onSubmit = async (data: any) => {
    try {
      const assetsList: string = assets
        .filter(
          (asset) => !loadedAssets.some((loaded) => loaded.id === asset.id),
        )
        .map((asset) => asset.id)
        .join(',');

      const themePayload = {
        ...data,
        assets: assetsList || '',
        font: assets[0]?.name?.match(/(.+?)(?=-|$)/)?.[1],
      };

      const apiUrl = isEdit ? `themes/${cId}` : 'themes';
      const apiMethod = isEdit ? putAPI : postAPI;

      const res = await apiMethod(apiUrl, themePayload);
      onUpdate && onUpdate(res);

      toast.success(isEdit ? 'Theme updated!' : 'Theme created!', {
        id: 'theme-submit',
        duration: 2000,
        position: 'top-right',
      });

      onDone();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      toast.error(errorMessage, {
        id: 'theme-submit',
        duration: 4000,
        position: 'top-right',
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

      trigger();
    }
  };

  const loadDataDetalis = (id: string) => {
    fetchAPI(`themes/${id}`).then((data: any) => {
      setContentDetails(data);
    });
    return false;
  };

  const onChangeField = (
    name: 'primary_color' | 'secondary_color' | 'body_color',
    value: any,
  ) => {
    setValue(name, value);
  };

  return (
    <>
      <Flex
        as="form"
        h="100vh"
        direction="column"
        onSubmit={handleSubmit(onSubmit)}>
        <Box flexShrink="0">
          <Drawer.Header>
            <Drawer.Title>
              {isEdit ? 'Edit Theme' : 'Create Theme'}
            </Drawer.Title>
            <X
              size={20}
              weight="bold"
              cursor="pointer"
              onClick={() => setIsOpen(false)}
            />
          </Drawer.Header>
        </Box>
        <Flex
          borderTop="1px solid"
          borderColor="border"
          direction="column"
          flex={1}
          gap="md"
          overflowY="auto"
          px="xl"
          py="md">
          <Box>
            <Field
              label="Name"
              required
              error={errors?.name?.message as string}>
              <InputText
                {...register('name')}
                placeholder="Enter a Layout Name"
              />
            </Field>
          </Box>
          <Box>
            <Label mb="md">Font</Label>
            <Box mb="sm" mt="xs">
              <FontList assets={assets} onDelete={deleteAsset} />
            </Box>

            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setIsFontOpen(true);
              }}
              variant="secondary">
              <PlusIcon size="16" />
              {assets.length > 0 ? 'Edit Fonts' : 'Add Fonts'}
            </Button>
          </Box>
          <Box>
            <Label mb="sm">Colors</Label>
            <Box border="solid 1px" borderColor="border" borderRadius="xs">
              <Box borderBottom="1px solid" borderColor="border">
                <FieldColor
                  register={register}
                  name="primary_color"
                  label="Primary Color"
                  defaultValue={
                    theme?.primary_color || DEFAULT_FORM.primary_color
                  }
                  onChangeColor={(value: string) =>
                    onChangeField('primary_color', value)
                  }
                />
              </Box>
              <Box borderBottom="1px solid" borderColor="border">
                <FieldColor
                  register={register}
                  name="secondary_color"
                  label="Secondary Color"
                  defaultValue={
                    theme?.secondary_color || DEFAULT_FORM.secondary_color
                  }
                  onChangeColor={(value: string) =>
                    onChangeField('secondary_color', value)
                  }
                />
              </Box>
              <Box>
                <FieldColor
                  register={register}
                  name="body_color"
                  label="Body Color"
                  defaultValue={theme?.body_color || DEFAULT_FORM.body_color}
                  onChangeColor={(value: string) =>
                    onChangeField('body_color', value)
                  }
                />
              </Box>
            </Box>
          </Box>

          {errors.root?.message && (
            <Text color="error">This field is required</Text>
          )}

          {theme?.file && (
            <Box>
              <Text>{theme?.file}</Text>
            </Box>
          )}
        </Flex>
        <Box flexShrink="0" px="xl" py="md" gap="sm">
          <Button disabled={!isValid} type="submit">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Flex>
      <Modal
        ariaLabel="Add Font"
        open={isFontOpen}
        onClose={() => setIsFontOpen(false)}>
        <>
          <Flex justify="space-between">
            <Modal.Header>Upload font</Modal.Header>
            <Box
              onClick={(e) => {
                e.preventDefault();
                setIsFontOpen(false);
              }}>
              <CloseIcon color="#2C3641" />
            </Box>
          </Flex>
          <Box w="518px">
            <AssetForm onUpload={addUploads} filetype="theme" />
          </Box>
        </>
      </Modal>
    </>
  );
};
export default ThemeAddForm;
