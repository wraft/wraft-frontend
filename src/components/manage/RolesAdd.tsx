/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react';
import { Label, Input, Box, Flex, Button, Text, Checkbox } from 'theme-ui';
// import { transparentize } from '@theme-ui/color';

import { Controller, useForm } from 'react-hook-form';
// import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

// import { Asset, Engine } from '../../utils/types';
import { loadEntity, createEntity } from '../../utils/models';

import Field from '../Field';
// import FieldText from '../FieldText';
// import Error from '../Error';
// import { TickIcon } from '../Icons';
import {
  Disclosure,
  DisclosureProvider,
  DisclosureContent,
} from '@ariakit/react';
// import { MenuItem } from '@ariakit/react';

interface Props {
  setOpen: any;
}

interface FormInputs {
  name: string;
  permissions: string[];
}

interface PermissionsItemProps {
  index: any;
  register: any;
  permission: any;
  handleCheckboxChange: any;
}
const PermissionsItem = ({
  index,
  register,
  permission,
  handleCheckboxChange,
}: PermissionsItemProps) => {
  return (
    <Box>
      <Label
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'neutral.1',
          py: '12px',
          px: '16px',
          ':last-of-type': {
            borderBottom: 'none',
          },
        }}>
        <Checkbox
          sx={{ width: '16px', height: '16px' }}
          {...register('permissions', { required: true })}
          value={permission.name}
          onChange={(e: any) => {
            handleCheckboxChange(e);
          }}
        />
        <Text
          variant="pR"
          sx={{ textTransform: 'capitalize', color: 'green.5' }}>
          {permission.action}
          {permission.name}
          {permission}
        </Text>
      </Label>
    </Box>
  );
};
const PermissionsAccordain = () => {
  return <Box>{/* <PermissionsItem /> */}</Box>;
};

const RolesAdd = ({ setOpen }: Props) => {
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const {
    // watch,
    register,
    // control,
    handleSubmit,
    // formState: { errors, isValid },
    // setValue,
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

  // const emailErrorRef = React.useRef<HTMLDivElement>(null);
  // const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // const filteredPermissions = permissions.filter((permission: any) =>
  //   permission.name.toLowerCase().includes(searchTerm.toLowerCase()),
  // );
  const permissionsArray = Object.entries(permissions);
  React.useEffect(() => {
    console.log('Array Permissions:', permissionsArray);
    console.table(permissionsArray);
  });

  const filteredPermissions = Object.keys(permissions).filter((e: any) =>
    e.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const filteredPermissions = Object.keys(permissions).filter((key: any) =>
  //   key.toLowerCase().includes(searchTerm.toLowerCase()),
  // );
  useEffect(() => {
    if (token) console.log('filtered permissions', filteredPermissions);
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

  const [checkboxStates, setCheckboxStates] = useState({});

  function onSuccess() {
    setOpen(false);
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
        overflow: 'hidden',
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
          <div sx={{}}>
            <Field
              label="Role Name"
              name="name"
              placeholder="Role Name"
              register={register}
            />
          </div>
          <Box>
            <Label htmlFor="search">Permssions</Label>
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
                // overflow: 'scroll',
                overflowX: 'hidden',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                scrollbarColor: 'red.5',
              }}>
              <Box>
                {filteredPermissions.map((key, index) => {
                  return (
                    <DisclosureProvider>
                      <Box key={index}>
                        <Disclosure
                          sx={{
                            width: '100%',
                            bg: 'bgWhite',
                            border: 'none',
                            py: '12px',
                            px: '16px',
                          }}>
                          <Box>
                            <Label
                              sx={{
                                display: 'flex',
                                maxWidth: 'max-content',
                                alignItems: 'center',
                                borderBottom: '1px solid',
                                borderColor: 'neutral.1',
                                ':last-of-type': {
                                  borderBottom: 'none',
                                },
                              }}>
                              {/* this checkbox should be checked when all of the sub checkbox is checked of i check or uncheck here all of the sub checkbox should also check uncheck */}
                              <Checkbox
                                sx={{ width: '16px', height: '16px' }}
                                {...register('permissions', { required: true })}
                                // value={permission.name}
                                // onChange={(e: any) => {
                                //   handleCheckboxChange(e);
                                // }}
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
                              <Box>
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
                                    onChange={(e: any) => {
                                      handleCheckboxChange(e);
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
          // disabled={true && !isValid}
          type="submit"
          variant="buttonPrimarySmall">
          Save
        </Button>
      </Box>
    </Flex>
  );
};
export default RolesAdd;
