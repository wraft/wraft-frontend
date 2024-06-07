import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DocumentIcon, TickIcon } from '@wraft/icon';
import { Drawer } from '@wraft-ui/Drawer';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text, Input, Label, useThemeUI } from 'theme-ui';

import { fetchAPI } from '../utils/models';
import { Asset } from '../utils/types';
import Field from './Field';
import FieldColor from './FieldColor';
import ThemeAddForm from './ThemeForm';

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

const ThemeForm = () => {
  // const [isEdit, setIsEdit] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const themeui = useThemeUI();
  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * Load Entity details to prefill form
   */

  useEffect(() => {
    if (cId) {
      // setIsEdit(true);
      loadDataDetalis(cId);
      setValue('edit', cId);
    }
  }, [cId]);

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

  return (
    <Fragment>
      <Flex>
        <Box
          as="form"
          onSubmit={handleSubmit(() => console.log('submit'))}
          sx={{ width: '50ch' }}>
          <Box>
            <Flex>
              <Box sx={{ width: '100%' }}>
                <Input type="hidden" {...register('edit')} />
                <Field
                  disable
                  name="name"
                  label="Name"
                  defaultValue="New Theme"
                  register={register}
                />
                <Box mt={3}>
                  <Label>Font</Label>
                  {assets && assets.length > 0 && (
                    <Box
                      sx={{
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: 'solid 1px',
                        borderColor: 'neutral.200',
                      }}>
                      {assets.map((m: any, index: number) => (
                        <Flex
                          key={m.id}
                          sx={{
                            py: 2,
                            px: 3,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom:
                              index < assets.length ? '1px solid' : 'none',
                            borderColor: 'neutral.200',
                          }}>
                          <Flex sx={{ alignItems: 'center' }}>
                            <Box
                              mr={2}
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <DocumentIcon
                                viewBox="0 0 24 24"
                                color={
                                  themeui?.theme?.colors?.gray?.[200] ||
                                  '#2C3641'
                                }
                              />
                            </Box>
                            <Text
                              as="p"
                              variant="pM"
                              sx={{ fontSize: 'xs', m: 0, p: 0, mb: 0 }}>
                              {m.name.match(/(.+?)(?=-|$)/)?.[1]}
                            </Text>
                          </Flex>
                          <Flex
                            sx={{
                              alignItems: 'center',
                              width: '80px',
                              justifyContent: 'space-between',
                              textTransform: 'uppercase',
                            }}>
                            <Text variant="capM" sx={{ color: 'gray.400' }}>
                              {m.name.match(/-(.+?)(?=\.[^.]*$|$)/)[1]}{' '}
                            </Text>
                            <Box
                              sx={{
                                height: '16px',
                                width: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bg: 'green.700',
                                borderRadius: '44px',
                              }}>
                              <TickIcon
                                color={themeui?.theme?.colors?.white as string}
                                height={12}
                                width={12}
                                viewBox="0 0 24 24"
                              />
                            </Box>
                          </Flex>
                        </Flex>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box mt={3}>
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
                        disable
                        register={register}
                        name="primary_color"
                        label="Primary Color"
                        defaultValue={theme?.primary_color || ''}
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
                  </Flex>
                </Box>
              </Box>

              {errors.root?.message && (
                <Text variant="error">This field is required</Text>
              )}
            </Flex>
          </Box>
          <Button
            mt={4}
            variant="buttonSecondary"
            onClick={() => setIsOpen(true)}>
            Edit
          </Button>
        </Box>
      </Flex>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        <ThemeAddForm setIsOpen={setIsOpen} />
      </Drawer>
    </Fragment>
  );
};
export default ThemeForm;
