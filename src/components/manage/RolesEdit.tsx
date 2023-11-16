/** @jsxImportSource theme-ui */
import { useEffect, useState } from 'react';
import { Label, Input, Box, Flex, Button, Text } from 'theme-ui';
import { Checkbox } from '@ariakit/react';

import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

import { loadEntity, updateEntity } from '../../utils/models';

import Field from '../Field';
import {
  Disclosure,
  DisclosureProvider,
  DisclosureContent,
} from '@ariakit/react';
import { ArrowDropdown } from '../Icons';
import theme from '../../utils/theme';

interface Props {
  setOpen: any;
  setRender: any;
  roleId: string;
}

interface FormInputs {
  name: string;
  permissions: string[];
}

const RolesAdd = ({ setOpen, setRender, roleId }: Props) => {
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const {
    register,
    trigger,
    handleSubmit,
    // formState: { isValid },
  } = useForm<FormInputs>({ mode: 'onChange' });

  const [initialPermissions, setInitialPermissions] = useState<any>({});
  const [role, setRole] = useState<any>({});
  const [permissions, setPermissions] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setExpanded] = useState<number | null>(null);

  const loadPermissionsSuccess = (data: any) => {
    setInitialPermissions(data);
  };

  const loadPermissions = (token: string) => {
    loadEntity(token, 'permissions', loadPermissionsSuccess);
  };

  const loadRolesOnSuccess = (data: any) => {
    setRole(data);
  };

  const loadRole = (token: string) => {
    loadEntity(token, `roles/${roleId}`, loadRolesOnSuccess);
  };

  useEffect(() => {
    if (token) {
      loadPermissions(token);
      loadRole(token);
    }
  }, [token]);

  const newPermissoinsFormat = Object.fromEntries(
    Object.entries(initialPermissions).map(
      ([category, datas]: [any, any[]]) => [
        category,
        {
          name: category,
          isChecked: false,
          children: datas.map((data: any) => ({ ...data, isChecked: false })),
        },
      ],
    ),
  );

  useEffect(() => {
    setPermissions(newPermissoinsFormat);
  }, [token, initialPermissions]);

  useEffect(() => {
    if (role) {
      const data = { ...permissions };
      filteredPermissionKeys.map((key) => {
        data[key].children.map((sub: any) => {
          if (role.permissions.includes(sub.name)) sub.isChecked = true;
        });
        const isAllSelected = data[key].children.every(
          (child: any) => child.isChecked === true,
        );
        if (isAllSelected) {
          data[key].isChecked = true;
        } else {
          data[key].isChecked = false;
        }
      });
      setPermissions({ ...data });
      trigger(['name', 'permissions'], { shouldFocus: true });
    }
  }, [role]);

  const filteredPermissionKeys = Object.keys(permissions).filter((e: any) =>
    e.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const checkParent = (e: any, name: any) => {
    const { checked } = e.target;
    const data = { ...permissions };
    data[name].isChecked = checked;

    if (data[name].isChecked) {
      data[name].children.map((child: any) => (child.isChecked = checked));
    } else {
      data[name].children.map((child: any) => (child.isChecked = false));
    }
    setPermissions({ ...data });
    trigger('permissions', { shouldFocus: true });
    trigger();
  };

  const checkChild = (e: any, name: any, id: any) => {
    const { checked } = e.target;
    const data = { ...permissions };

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
    setPermissions({ ...data });
  };

  function onSuccess() {
    setOpen(null);
    setRender((prev: boolean) => !prev);
    addToast(`Role Edited `, { appearance: 'success' });
  }

  const checkedValuesFunc = (permissionsList: string[]) => {
    filteredPermissionKeys.forEach((key) => {
      permissions[key].children.forEach((e: any) => {
        if (e.isChecked === true) {
          permissionsList.push(e.name);
        }
      });
    });
  };
  function onSubmit(data: any) {
    const permissionsList: string[] = [];
    checkedValuesFunc(permissionsList);
    const body = {
      name: data.name,
      permissions: permissionsList,
    };
    updateEntity(`roles/${role.id}`, body, token, onSuccess);
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
        height: '100%',
      }}>
      <Flex
        sx={{
          flexDirection: 'column',
        }}>
        <Box>
          <Box
            sx={{
              px: 4,
              py: 3,
              borderBottom: '1px solid',
              borderColor: 'gray.0',
            }}>
            <Text variant="pB">Edit role</Text>
          </Box>
          <Box sx={{ p: 4, pt: 3 }}>
            <div>
              <Field
                label="Role Name"
                name="name"
                placeholder="Role Name"
                defaultValue={role.name}
                register={register}
              />
            </div>
            <Box sx={{ pt: 2 }}>
              <Label htmlFor="search">Permissions</Label>
              <Input
                type="search"
                placeholder="Search by"
                onChange={(e: any) => setSearchTerm(e.target.value)}
                sx={{ bg: 'background' }}
              />
            </Box>
            <Box>
              <Flex
                sx={{
                  flexDirection: 'column',
                  mt: '18px',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  maxHeight: '400px',
                  overflowX: 'hidden',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  scrollbarColor: 'red.5',
                }}>
                <Box>
                  {filteredPermissionKeys.map((key, index) => {
                    const dropped = isExpanded === index;
                    return (
                      <DisclosureProvider key={index}>
                        <Box>
                          <Disclosure
                            onClick={() => {
                              if (isExpanded === index) setExpanded(null);
                              else setExpanded(index);
                            }}
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
                            <Flex
                              sx={{
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <Label
                                sx={{
                                  display: 'flex',
                                  maxWidth: 'max-content',
                                  alignItems: 'center',
                                }}>
                                <Checkbox
                                  sx={{
                                    width: '14px',
                                    height: '14px',
                                    accentColor:
                                      theme?.colors &&
                                      ((theme?.colors?.gray ??
                                        [])[9] as string),
                                  }}
                                  checked={permissions[key].isChecked}
                                  onChange={(e: any) => {
                                    checkParent(e, permissions[key].name);
                                  }}
                                />
                                <Text
                                  variant="pR"
                                  sx={{
                                    pl: 1,
                                    textTransform: 'capitalize',
                                    color: 'gray.7',
                                  }}>
                                  {permissions[key].name}
                                </Text>
                              </Label>
                              <Flex
                                as={'div'}
                                className="icon"
                                sx={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  transform: dropped && 'rotate(180deg)',
                                  color: 'gray.2',
                                }}>
                                <ArrowDropdown />
                              </Flex>
                            </Flex>
                          </Disclosure>
                          <DisclosureContent>
                            <Box>
                              {permissions[key].children.map((sub: any) => (
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
                                      sx={{
                                        width: '12px',
                                        height: '12px',
                                        accentColor:
                                          theme?.colors &&
                                          ((theme?.colors?.gray ??
                                            [])[9] as string),
                                      }}
                                      {...register('permissions')}
                                      // value={sub.name}
                                      checked={sub.isChecked}
                                      onChange={(e: any) => {
                                        checkChild(
                                          e,
                                          permissions[key].name,
                                          sub.id,
                                        );
                                      }}
                                    />
                                    <Text
                                      variant="subR"
                                      sx={{
                                        pl: 1,
                                        textTransform: 'capitalize',
                                        color: 'gray.4',
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
      </Flex>
      <Box sx={{ p: 4, pt: 2 }}>
        <Button
          onMouseOver={() => trigger()}
          type="submit"
          variant="buttonPrimarySmall">
          Save
        </Button>
      </Box>
    </Flex>
  );
};
export default RolesAdd;
