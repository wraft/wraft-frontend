/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react';
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

// interface PermissionsItemProps {
//   index: any;
//   register: any;
//   permission: any;
//   handleCheckboxChange: any;
// }
// const PermissionsItem = ({
//   index,
//   register,
//   permission,
//   handleCheckboxChange,
// }: PermissionsItemProps) => {
//   return (
//     <Box>
//       <Label
//         key={index}
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           borderBottom: '1px solid',
//           borderColor: 'neutral.1',
//           py: '12px',
//           px: '16px',
//           ':last-of-type': {
//             borderBottom: 'none',
//           },
//         }}>
//         <Checkbox
//           sx={{ width: '16px', height: '16px' }}
//           {...register('permissions', { required: true })}
//           value={permission.name}
//           onChange={(e: any) => {
//             handleCheckboxChange(e);
//           }}
//         />
//         <Text
//           variant="pR"
//           sx={{ textTransform: 'capitalize', color: 'green.5' }}>
//           {permission.action}
//           {permission.name}
//           {permission}
//         </Text>
//       </Label>
//     </Box>
//   );
// };
// const PermissionsAccordain = () => {
//   return <Box>{/* <PermissionsItem /> */}</Box>;
// };

const RolesAdd = ({ setOpen }: Props) => {
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormInputs>({ mode: 'all' });

  const [permissions, setPermissions] = React.useState<any>({});

  const loadPermissionsSuccess = (data: any) => {
    console.log(data);
    setPermissions(data);
  };

  const loadPermissions = (token: string) => {
    loadEntity(token, 'permissions', loadPermissionsSuccess);
  };

  React.useEffect(() => {
    loadPermissions(token);
  }, []);

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredPermissionKeys = Object.keys(permissions).filter((e: any) =>
    e.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [isParentChecked, setIsParentChecked] = useState<any>([]);
  const changeCheckboxStatus = (e: any, id: any) => {
    const users = { ...permissions };
    const { checked } = e.target;
    filteredPermissionKeys.map((key: any) => {
      users[key].map((sub: any) => {
        if (id === key) {
          setIsParentChecked([...isParentChecked, key]);
          sub.isChecked = checked;
        } else {
          if (sub.id === id) {
            sub.isChecked = checked;
          }
          const isAllChildsChecked = users[key].every(
            (sub: any) => sub.isChecked === true,
          );
          console.log('is all child checked?', isAllChildsChecked);
          if (isAllChildsChecked) {
            setIsParentChecked([...isParentChecked, key]);
            // setIsParentChecked(key);
          } else {
            // setIsParentChecked(null);
            setIsParentChecked(
              isParentChecked.filter((item: any) => item !== key),
            );
          }
        }
      });
      return users;
    });
    setPermissions({ ...users });
    console.log('permssions after onchange', permissions);
  };

  useEffect(() => {
    if (token) console.log('filtered permissions', filteredPermissionKeys);
  }, [token]);

  const [checkedValues, setCheckedValues] = React.useState<any>([]);

  const handleCheckboxChange = (event: any) => {
    const checked = event.target.checked;
    const value = event.target.value;

    if (checked) {
      console.log('checked', value);
      setCheckedValues([...checkedValues, value]);
    } else {
      console.log('unchecked', value);
      setCheckedValues(checkedValues.filter((item: any) => item !== value));
    }
  };

  function onSuccess() {
    setOpen(false);
    addToast(`Role Added `, { appearance: 'success' });
  }

  function onSubmit(data: any) {
    console.log('submitted', data);
    const dataNew = {
      name: data.name,
      permissions: checkedValues,
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
        // height: '100%',
        maxHeight: '100dvh',
        // overflow: 'hidden',
        // overflowY: 'hidden',
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
                                // {...register('permissions', { required: true })}
                                // onChange={(e) => changeCheckboxStatus(e, 'p1')}
                                checked={isParentChecked.includes(`${key}`)}
                                // checked={true}
                                // value={key}
                                onChange={(e: any) => {
                                  handleCheckboxChange(e);
                                  changeCheckboxStatus(e, key);
                                }}
                              />
                              <Text
                                variant="pR"
                                sx={{
                                  textTransform: 'capitalize',
                                  color: 'green.5',
                                }}>
                                {key}
                              </Text>
                            </Label>
                          </Box>
                        </Disclosure>
                        <DisclosureContent>
                          <Box>
                            {permissions[key].map((sub: any) => (
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
                                    checked={sub?.isChecked}
                                    onChange={(e: any) => {
                                      handleCheckboxChange(e);
                                      changeCheckboxStatus(e, sub.id);
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
