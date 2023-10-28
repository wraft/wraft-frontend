/** @jsxImportSource theme-ui */
import { useEffect, useState } from 'react';
import { Label, Input, Box, Flex, Button, Text, Checkbox } from 'theme-ui';

import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

import { loadEntity, createEntity } from '../../utils/models';

import Field from '../Field';
import {
  Disclosure,
  DisclosureProvider,
  DisclosureContent,
} from '@ariakit/react';

interface Props {
  setOpen: any;
}

interface FormInputs {
  name: string;
  permissions: string[];
}

const RolesAdd = ({ setOpen }: Props) => {
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormInputs>({ mode: 'onChange' });

  const [permissions, setPermissions] = useState<any>({});
  const [newDataFormat, setNewDataFormat] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadPermissionsSuccess = (data: any) => {
    console.log(data);
    setPermissions(data);
  };

  const loadPermissions = (token: string) => {
    loadEntity(token, 'permissions', loadPermissionsSuccess);
  };

  useEffect(() => {
    if (token) loadPermissions(token);
  }, [token]);

  const newFormat = Object.fromEntries(
    Object.entries(permissions).map(([category, datas]: [any, any[]]) => [
      category,
      {
        name: category,
        isChecked: false,
        children: datas.map((data: any) => ({ ...data, isChecked: false })),
      },
    ]),
  );

  useEffect(() => {
    setNewDataFormat(newFormat);
    console.log('new Data for permissions', newFormat);
  }, [token, permissions]);

  const filteredPermissionKeys = Object.keys(newDataFormat).filter((e: any) =>
    e.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const checkParent = (e: any, name: any) => {
    const { checked } = e.target;
    const data = { ...newDataFormat };
    data[name].isChecked = checked;

    if (data[name].isChecked) {
      data[name].children.map((child: any) => (child.isChecked = checked));
    } else {
      data[name].children.map((child: any) => (child.isChecked = false));
    }
    setNewDataFormat({ ...data });
    console.log('parent', newDataFormat);
  };

  const checkChild = (e: any, name: any, id: any) => {
    const { checked } = e.target;
    const data = { ...newDataFormat };

    data[name].children.map((sub: any) => {
      if (sub.id === id) {
        sub.isChecked = checked;
      }
      const isAllSelected = data[name].children.every(
        (child: any) => child.isChecked === true,
      );
      if (isAllSelected) {
        data[name].isChecked = checked;
      } else {
        data[name].isChecked = false;
      }
    });
    setNewDataFormat({ ...data });
    console.log('child', newDataFormat);
  };

  function onSuccess() {
    setOpen(false);
    addToast(`Role Added `, { appearance: 'success' });
  }

  function onSubmit(data: any) {
    console.log('submitted', data);
    console.log('submitted permissions', data.permissions);
    const dataNew = {
      name: data.name,
      permissions: data.permissions,
    };
    createEntity(dataNew, 'roles', token, onSuccess);
  }

  return (
    <Flex
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        bg: 'bgWhite',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxHeight: '100dvh',
      }}>
      <Box>
        <Box
          sx={{
            px: 4,
            py: 3,
            borderBottom: '1px solid',
            borderColor: 'gray.0',
          }}>
          <Text variant="pB">Create new role</Text>
        </Box>
        <Box sx={{ p: 4 }}>
          <div>
            <Field
              label="Role Name"
              name="name"
              placeholder="Role Name"
              register={register}
            />
          </div>
          <Box>
            <Label htmlFor="search">Permissions</Label>
            <Input
              type="search"
              placeholder="Search by"
              onChange={(e: any) => setSearchTerm(e.target.value)}
              sx={{ bg: 'background' }}
            />
          </Box>
          <Box sx={{ maxHeight: '500px', overflow: 'hidden' }}>
            <Flex
              sx={{
                flexDirection: 'column',
                mt: '18px',
                border: '1px solid',
                borderColor: 'neutral.1',
                borderRadius: 4,
                maxHeight: '450px',
                overflowX: 'hidden',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                scrollbarColor: 'red.5',
              }}>
              <Box>
                {filteredPermissionKeys.map((key, index) => {
                  return (
                    <DisclosureProvider key={index}>
                      <Box>
                        <Disclosure
                          sx={{
                            width: '100%',
                            bg: 'bgWhite',
                            py: '12px',
                            px: '16px',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: '1px solid',
                            borderColor: 'neutral.2',
                            ':last-of-type': {
                              borderBottom: 'none',
                            },
                          }}>
                          <Box>
                            <Label
                              sx={{
                                display: 'flex',
                                maxWidth: 'max-content',
                                alignItems: 'center',
                              }}>
                              <Checkbox
                                sx={{ width: '16px', height: '16px' }}
                                checked={newDataFormat[key].isChecked}
                                onChange={(e: any) => {
                                  checkParent(e, newDataFormat[key].name);
                                }}
                              />
                              <Text
                                variant="pR"
                                sx={{
                                  textTransform: 'capitalize',
                                  color: 'green.5',
                                }}>
                                {newDataFormat[key].name}
                              </Text>
                            </Label>
                          </Box>
                        </Disclosure>
                        <DisclosureContent>
                          <Box>
                            {newDataFormat[key].children.map((sub: any) => (
                              <Box key={sub.id}>
                                <Label
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'neutral.1',
                                    bg: 'background',
                                    py: '12px',
                                    px: '16px',
                                    ':last-of-type': {
                                      borderBottom: 'none',
                                    },
                                  }}>
                                  <Checkbox
                                    sx={{ width: '16px', height: '16px' }}
                                    {...register('permissions', {
                                      required: true,
                                    })}
                                    value={sub.name}
                                    checked={sub.isChecked}
                                    onChange={(e: any) => {
                                      checkChild(
                                        e,
                                        newDataFormat[key].name,
                                        sub.id,
                                      );
                                    }}
                                  />
                                  <Text
                                    variant="pR"
                                    sx={{
                                      textTransform: 'capitalize',
                                      color: 'green.5',
                                    }}>
                                    {sub.action}
                                  </Text>
                                </Label>
                              </Box>
                            ))}
                          </Box>
                        </DisclosureContent>
                      </Box>
                    </DisclosureProvider>
                  );
                })}
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 4 }}>
        <Button
          disabled={true && !isValid}
          type="submit"
          variant="buttonPrimarySmall">
          Save
        </Button>
      </Box>
    </Flex>
  );
};
export default RolesAdd;
