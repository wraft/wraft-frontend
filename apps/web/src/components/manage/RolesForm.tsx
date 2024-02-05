/** @jsxImportSource theme-ui */
import { useEffect, useState } from 'react';

import { Checkbox } from '@ariakit/react';
import {
  Disclosure,
  DisclosureProvider,
  DisclosureContent,
} from '@ariakit/react';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Label, Input, Box, Flex, Button, Text } from 'theme-ui';

import { putAPI, fetchAPI, postAPI } from '../../utils/models';
import Field from '../Field';
import { ArrowDropdown } from '../Icons';

interface Props {
  setOpen: any;
  setRender: any;
  roleId?: string;
}

interface FormInputs {
  name: string;
  permissions: string[];
}

const RolesForm = ({ setOpen, setRender, roleId }: Props) => {
  const isEdit = roleId && roleId !== (null || undefined || '');
  const {
    register,
    trigger,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange',
  });

  const [initialPermissions, setInitialPermissions] = useState<any>({});
  const [role, setRole] = useState<any>({});
  const [permissions, setPermissions] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setExpanded] = useState<number | null>(null);
  const [formStep, setFormStep] = useState(0);

  const loadPermissions = () => {
    fetchAPI('permissions').then((data: any) => {
      setInitialPermissions(data);
    });
  };

  const loadRole = () => {
    if (isEdit) {
      fetchAPI(`roles/${roleId}`).then((data: any) => {
        setRole(data);
      });
    }
  };

  useEffect(() => {
    loadPermissions();
    loadRole();
  }, []);

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
  }, [initialPermissions]);

  useEffect(() => {
    if (role) {
      const data = { ...permissions };
      filteredPermissionKeys.map((key) => {
        data[key].children.map((sub: any) => {
          if (role.permissions && role.permissions.includes(sub.name))
            sub.isChecked = true;
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

  const checkedValuesFunc = (permissionsList: string[]) => {
    filteredPermissionKeys.forEach((key) => {
      permissions[key].children.forEach((e: any) => {
        if (e.isChecked === true) {
          permissionsList.push(e.name);
        }
      });
    });
  };

  function next() {
    setFormStep((i) => i + 1);
  }
  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };

  function onSubmit(data: any) {
    const permissionsList: string[] = [];
    checkedValuesFunc(permissionsList);

    const body = {
      name: data.name,
      permissions: permissionsList,
    };
    const text = isEdit ? 'Edit' : 'Create';
    const Request = isEdit
      ? putAPI(`roles/${role.id}`, body)
      : postAPI('roles', body);

    toast.promise(
      Request,
      {
        loading: 'Loading...',
        success: () => {
          if (formStep === 1) {
            setOpen(null);
            setFormStep(0);
            setRender((prev: boolean) => !prev);
          }
          return `Role ${text}ed`;
        },
        error: () => {
          return `Failed to ${text} role`;
        },
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    );
  }

  return (
    <Flex
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        bg: 'backgroundWhite',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100dvh',
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
              borderColor: 'border',
            }}>
            <Text variant="pB">{isEdit ? 'Edit Role' : 'Create new role'}</Text>
          </Box>
          <StepsIndicator
            titles={['Details', 'Permissions']}
            formStep={formStep}
            goTo={goTo}
          />
          <Box sx={{ p: 4, pt: 3 }}>
            <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
              <Field
                label="Role Name"
                name="name"
                placeholder="Role Name"
                defaultValue={role.name}
                register={register}
              />
            </Box>
            <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
              <Box>
                <Label htmlFor="search">Permissions</Label>
                <Input
                  type="search"
                  placeholder="Search by"
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  sx={{ bg: 'background' }}
                />
              </Box>
              <Flex
                sx={{
                  flexDirection: 'column',
                  mt: '18px',
                  border: '1px solid',
                  borderColor: 'border',
                  borderRadius: 4,
                  maxHeight: '400px',
                  overflowX: 'hidden',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  scrollbarColor: 'red.600',
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
                              bg: 'backgroundWhite',
                              py: '12px',
                              px: '16px',
                              borderTop: 'none',
                              borderLeft: 'none',
                              borderRight: 'none',
                              borderBottom: '1px solid',
                              borderColor: 'border',
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
                                    accentColor: 'gray.1000',
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
                                    color: 'text',
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
                                  color: 'gray.300',
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
                                      borderColor: 'border',
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
                                        accentColor: 'gray.900',
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
                                        color: 'gray.500',
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
      <Flex sx={{ p: 4, pt: 2, gap: 2, mt: 'auto' }}>
        <Button
          sx={{ display: formStep === 0 ? 'block' : 'none' }}
          variant="buttonPrimary"
          onClick={(e) => {
            e.preventDefault();
            next();
          }}>
          Next
        </Button>
        <Button
          sx={{ display: formStep === 1 ? 'block' : 'none' }}
          variant="buttonSecondary"
          onClick={(e) => {
            e.preventDefault();
            prev();
          }}>
          Prev
        </Button>
        <Button
          disabled={!isValid}
          onMouseOver={() => trigger()}
          onClick={() => {
            if (formStep === 0) {
              next();
            }
          }}
          type="submit"
          variant="buttonPrimarySmall">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Flex>
    </Flex>
  );
};
export default RolesForm;
