import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DocumentIcon, TickIcon } from '@wraft/icon';
import { useForm, useWatch } from 'react-hook-form';
import { useThemeUI } from 'theme-ui';
import {
  Box,
  Button,
  Drawer,
  Field,
  Flex,
  InputText,
  Label,
  Text,
  useDrawer,
} from '@wraft/ui';

import ThemeAddForm from 'components/Theme/ThemeForm';
import FieldColor from 'common/FieldColor';
import { fetchAPI } from 'utils/models';
import { Asset } from 'utils/types';

import ThemePreview from './ThemePreview';

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

  const { register, setValue, watch } = useForm<FormValues>({
    mode: 'onSubmit',
  });
  const watchedColors = watch([
    'primary_color',
    'secondary_color',
    'body_color',
  ]);
  const [primaryColor, secondaryColor, bodyColor] = watchedColors;

  const themeui = useThemeUI();
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
      <Flex direction="row">
        <Box as="form" maxWidth="556px" bg="background-primary" w="40%" p="xl">
          <Flex direction="column" gap="md">
            <Box>
              <Field label="Layout Name" disabled required>
                <InputText {...register('name')} />
              </Field>
            </Box>
            <Box mt={3}>
              <Label>Font</Label>
              {assets && assets.length > 0 && (
                <Box
                  border="solid 1px"
                  borderColor="border"
                  borderRadius="sm"
                  overflow="hidden">
                  {assets.map((m: any, index: number) => (
                    <Flex
                      key={m.id}
                      alignItems="center"
                      borderBottom={
                        index < assets.length ? '1px solid' : 'none'
                      }
                      borderColor="border"
                      justify="space-between"
                      px="sm"
                      py="sm">
                      <Flex align="center" gap="xs">
                        <Box>
                          <DocumentIcon
                            viewBox="0 0 24 24"
                            color={
                              themeui?.theme?.colors?.gray?.[400] || '#2C3641'
                            }
                          />
                        </Box>
                        <Text>{m?.name.match(/(.+?)(?=-|$)/)?.[1]}</Text>
                      </Flex>
                      <Flex align="center" gap="xs">
                        <Text>
                          {m?.name.match(/-(.+?)(?=\.[^.]*$|$)/)?.[1] ?? 'N/A'}
                        </Text>
                        <Flex
                          align="center"
                          bg="green.700"
                          borderRadius="full"
                          justify="center"
                          h="16px"
                          w="16px">
                          <TickIcon
                            color={themeui?.theme?.colors?.white as string}
                            height={12}
                            width={12}
                            viewBox="0 0 24 24"
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
            <Box>
              <Label>Colors</Label>
              <Box
                border="solid 1px"
                borderColor="border"
                borderRadius="6px"
                overflow="hidden">
                <Box borderBottom="1px solid" borderColor="border">
                  <FieldColor
                    disable
                    register={register}
                    name="primary_color"
                    label="Primary Color"
                    defaultValue={theme?.primary_color || ''}
                    variant="inside"
                    border="none"
                  />
                </Box>
                <Box borderBottom="1px solid" borderColor="border">
                  <FieldColor
                    disable
                    register={register}
                    name="secondary_color"
                    label="Secondary Color"
                    defaultValue={theme?.secondary_color || ''}
                    variant="inside"
                    border="none"
                  />
                </Box>
                <Box>
                  <FieldColor
                    disable
                    register={register}
                    name="body_color"
                    label="Body Color"
                    defaultValue={theme?.body_color || ''}
                    variant="inside"
                    border="none"
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

        <Box>
          <ThemePreview
            primaryColor={primaryColor || '#000000'}
            secondaryColor={secondaryColor || '#000000'}
            bodyColor={bodyColor || '#FFFFFF'}
            fontFamily={`${currentFontFamily}, sans-serif`}
          />
        </Box>
      </Flex>

      <Drawer
        open={isOpen}
        store={drawer}
        aria-label="flow drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        <ThemeAddForm setIsOpen={setIsOpen} />
      </Drawer>
    </>
  );
};
export default ThemeForm;
