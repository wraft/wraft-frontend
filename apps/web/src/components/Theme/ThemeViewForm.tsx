import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Drawer,
  Field,
  Flex,
  InputText,
  Label,
  useDrawer,
} from '@wraft/ui';

import ThemeAddForm from 'components/Theme/ThemeForm';
import FieldColor from 'common/FieldColor';
import { fetchAPI } from 'utils/models';
import { Asset } from 'utils/types';

import ThemePreview from './ThemePreview';
import FontList from './FontList';

type FormValues = {
  edit: string;
  name: string;
  font: string;
  primary_color: string;
  secondary_color: string;
  body_color: string;
};

const ThemeForm = () => {
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>(null);

  const { register, setValue } = useForm<FormValues>({
    mode: 'onSubmit',
  });

  const router = useRouter();
  const drawer = useDrawer();
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (cId) {
      loadDataDetalis(cId);
    }
  }, [cId]);

  const setContentDetails = (data: any) => {
    const res: any = data;

    if (res && res?.theme) {
      setTheme(res.theme);
      setValue('name', res.theme.name || '');
      setValue('font', res.theme.font || '');
      setValue('body_color', res.theme.body_color || '');
      setValue('primary_color', res.theme.primary_color || '');
      setValue('secondary_color', res.theme.secondary_color || '');
      setAssets(res.theme.assets || []);
    }
  };

  const loadDataDetalis = (id: string) => {
    fetchAPI(`themes/${id}`).then((data: any) => {
      setContentDetails(data);
    });
    return false;
  };

  const currentFontFamily =
    assets && assets.length > 0
      ? assets[0]?.name?.match(/(.+?)(?=-|$)/)?.[1] || 'Arial'
      : 'Arial';

  return (
    <>
      <Flex direction="row" gap="xxl">
        <Box as="form" maxWidth="556px" bg="background-primary" w="40%" p="xl">
          <Flex direction="column" gap="md">
            <Box>
              <Field label="Layout Name" disabled required>
                <InputText {...register('name')} />
              </Field>
            </Box>
            <Box mt={3}>
              <Label>Font</Label>
              {assets && assets.length > 0 && <FontList assets={assets} />}
            </Box>
            <Box>
              <Label>Colors</Label>
              <Box
                border="solid 1px"
                borderColor="border"
                borderRadius="sm"
                overflow="hidden">
                <Box borderBottom="1px solid" borderColor="border">
                  <FieldColor
                    defaultValue={theme?.primary_color || ''}
                    disabled
                    label="Primary Color"
                    name="primary_color"
                    readOnly={true}
                    register={register}
                  />
                </Box>
                <Box borderBottom="1px solid" borderColor="border">
                  <FieldColor
                    disabled
                    register={register}
                    name="secondary_color"
                    label="Secondary Color"
                    defaultValue={theme?.secondary_color || ''}
                    readOnly={true}
                  />
                </Box>
                <Box>
                  <FieldColor
                    disabled
                    register={register}
                    name="body_color"
                    label="Body Color"
                    defaultValue={theme?.body_color || ''}
                    readOnly={true}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Button variant="secondary" onClick={() => setIsOpen(true)}>
                Edit
              </Button>
            </Box>
          </Flex>
        </Box>

        <ThemePreview
          primaryColor={theme?.primary_color || '#2563eb'}
          secondaryColor={theme?.secondary_color || '#374151'}
          bodyColor={theme?.body_color || '#ffffff'}
          fontFamily={`${currentFontFamily}, sans-serif`}
        />
      </Flex>

      <Drawer
        open={isOpen}
        store={drawer}
        aria-label="flow drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        <ThemeAddForm
          setIsOpen={setIsOpen}
          onUpdate={(data: any) => setTheme(data)}
        />
      </Drawer>
    </>
  );
};
export default ThemeForm;
