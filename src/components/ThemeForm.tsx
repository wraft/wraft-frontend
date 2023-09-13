import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';
import Router, { useRouter } from 'next/router';

import { Label, Input, Checkbox } from 'theme-ui';

import Field from './Field';
import {
  createEntityFile,
  loadEntityDetail,
  updateEntityFile,
} from '../utils/models';
import FieldColor from './FieldColor';

interface ThemeElement {
  name: string;
  file?: string;
  font?: string;
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

  const token = useStoreState((state) => state.auth.token);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * On Theme Created
   */
  const onDone = () => {
    addToast('Saved Successfully', { appearance: 'success' });
    Router.push(`/themes`);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();

    // @TODO - do what ?
    const stat = 'f67d779f-3b55-4428-99f1-1efe84305f93';

    // only if files's presetn
    // if(data.file?.size > 0) {
    //   formData.append('file', data.file[0]);
    // }

    const typeScaleValue: any = { h1: 10, p: 6, h2: 8 };

    // formData.append('assets', data.file[0]);

    formData.append('name', data.name);
    formData.append('font', data.font);
    formData.append('secondary_color', data?.secondary_color);
    formData.append('primary_color', data?.primary_color);
    formData.append('body_color', data?.body_color);
    formData.append('typescale', typeScaleValue);

    formData.append('content_type_id', stat);
    formData.append('default_theme', data?.default_theme);

    if (data?.edit) {
      updateEntityFile(`themes/${data?.edit}`, formData, token, onDone);
    } else {
      createEntityFile(formData, token, 'themes', onDone);
    }
  };

  const setContentDetails = (data: any) => {
    const res: any = data;
    // setContent(res);

    if (res && res?.theme) {
      const currTheme: ThemeElement = res?.theme;
      setTheme(currTheme);

      console.log('theme', res);

      setValue('name', currTheme?.name);
      setValue('font', currTheme?.font);

      // setValue('prefix', res.content_type.prefix);
      // setValue('layout_id', res.content_type.layout?.id || undefined);
      // setValue('edit', res.content_type.id);
      // setValue('color', res.content_type.color);
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
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Box mx={0} mb={3}>
        <Flex>
          <Box>
            <Input
              // name="edit"
              type="hidden"
              // ref={register}
              {...register('edit')}
            />
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
            <Box
              sx={{
                p: 3,
                bg: 'gray.2',
                border: 'solid 1px',
                borderColor: 'gray.3',
              }}>
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
            <Field
              name="typescale"
              label="Typescale"
              defaultValue="1.25"
              register={register}
            />
            <Box>
              <Label htmlFor="name" mb={1}>
                File ( only ttf/otf)
              </Label>
              <Input
                id="file"
                // name="file"
                type="file"
                // ref={register}
                {...register('file')}
              />
            </Box>

            <Box>
              <Label htmlFor="name" mb={1}>
                Default Theme?
              </Label>
              <Checkbox
                // ref={register}
                defaultChecked={true}
                // name="default_theme"
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
      <Button ml={2}>{isEdit ? 'Update' : 'Create Theme'}</Button>
    </Box>
  );
};
export default ThemeForm;
