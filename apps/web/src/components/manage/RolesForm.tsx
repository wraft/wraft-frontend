import { useEffect, useState, useCallback } from 'react';
import {
  Disclosure,
  DisclosureProvider,
  DisclosureContent,
} from '@ariakit/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Label, InputText, Box, Flex, Button, Text, Checkbox } from '@wraft/ui';
import { DownIcon } from '@wraft/icon';
import { Drawer, Field } from '@wraft/ui';
import { X } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import StepsIndicator from 'common/Form/StepsIndicator';
import { putAPI, fetchAPI, postAPI } from 'utils/models';
import { safeTextRegex } from 'utils/regex';

const StyledDisclosure = styled(Disclosure)`
  width: 100%;
  background-color: var(--theme-ui-colors-background-primary);
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid var(--theme-ui-colors-neutral-200);
  display: flex;
  align-items: center;
`;

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--theme-ui-colors-border);
  background-color: var(--theme-ui-colors-background-primary);
  padding: 12px 16px;
  margin-bottom: 0;

  &:last-of-type {
    border-bottom: none;
  }
`;

const iconStyle = (props: { dropped: boolean }) => css`
  transform: ${props.dropped ? 'rotate(180deg)' : 'none'};
  color: gray.800;
`;

const IconWrapper = styled(Flex)<{ dropped: boolean }>`
  justify-content: center;
  align-items: center;
  ${(props: any) => iconStyle(props)}
`;

interface RolesFormProps {
  setOpen: any;
  setRender: any;
  roleId?: any;
}

const roleFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Role name is required' })
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed'),
  permissions: z
    .array(z.string())
    .min(1, { message: 'At least one permission is required' }),
});

type FormInputs = z.infer<typeof roleFormSchema>;

const RolesForm = ({ setOpen, setRender, roleId }: RolesFormProps) => {
  const [formStep, setFormStep] = useState(0);
  const [initialPermissions, setInitialPermissions] = useState<any>({});
  const [isExpanded, setExpanded] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>({});
  const [role, setRole] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isEditMode = Boolean(roleId);

  const {
    register,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange',
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const fetchPermissions = () => {
    fetchAPI('permissions').then((data: any) => {
      setInitialPermissions(data);
    });
  };

  const fetchRoleDetails = () => {
    if (isEditMode) {
      fetchAPI(`roles/${roleId}`).then((data: any) => {
        setRole(data);
        if (data.name) setValue('name', data.name);
        if (data.permissions) setValue('permissions', data.permissions);
      });
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchRoleDetails();
  }, []);

  useEffect(() => {
    register('permissions');
  }, [register]);

  const formatPermissions = useCallback(() => {
    return Object.fromEntries(
      Object.entries(initialPermissions).map(
        ([category, items]: [string, any[]]) => [
          category,
          {
            name: category,
            isChecked: false,
            children: items.map((item: any) => ({ ...item, isChecked: false })),
          },
        ],
      ),
    );
  }, [initialPermissions]);

  useEffect(() => {
    setPermissions(formatPermissions);
  }, [initialPermissions]);

  useEffect(() => {
    if (role.permissions && Object.keys(permissions).length > 0) {
      setValue('permissions', role.permissions);

      const data = { ...permissions };
      const selectedPermissions = role.permissions || [];

      Object.keys(data).forEach((category) => {
        data[category].children.forEach((sub: any) => {
          sub.isChecked = selectedPermissions.includes(sub.name);
        });

        const isAllSelected = data[category].children.every(
          (child: any) => child.isChecked === true,
        );
        data[category].isChecked = isAllSelected;
      });

      setPermissions(data);
    }
  }, [role, setValue]);

  const filteredPermissionKeys = Object.keys(permissions).filter((e: any) =>
    e.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleParentCheckboxChange = (e: any, name: any) => {
    e.persist();

    const checked = e.target.checked;
    const data = { ...permissions };
    data[name].isChecked = checked;

    const currentPermissions = watch('permissions') || [];
    let newPermissions: string[] = [...currentPermissions];

    data[name].children.forEach((child: any) => {
      child.isChecked = checked;

      if (checked) {
        if (!newPermissions.includes(child.name)) {
          newPermissions.push(child.name);
        }
      } else {
        newPermissions = newPermissions.filter((perm) => perm !== child.name);
      }
    });

    setValue('permissions', newPermissions);
    setPermissions(data);

    trigger('permissions').then((valid) => {
      if (!valid && newPermissions.length === 0) {
        toast.error('At least one permission is required', {
          duration: 2000,
          position: 'top-right',
        });
      }
    });
  };

  const handleChildCheckboxChange = (e: any, name: any, id: any) => {
    e.persist();

    const checked = e.target.checked;
    const data = JSON.parse(JSON.stringify(permissions));

    const currentPermissions = watch('permissions') || [];
    let newPermissions: string[] = [...currentPermissions];

    let childToUpdate: any = null;
    data[name].children.forEach((sub: any) => {
      if (sub.id === id) {
        sub.isChecked = checked;
        childToUpdate = sub;
      }
    });

    if (childToUpdate) {
      if (checked) {
        if (!newPermissions.includes(childToUpdate.name)) {
          newPermissions.push(childToUpdate.name);
        }
      } else {
        newPermissions = newPermissions.filter(
          (perm) => perm !== childToUpdate.name,
        );
      }
    }

    const isAllSelected = data[name].children.every(
      (child: any) => child.isChecked === true,
    );
    data[name].isChecked = isAllSelected;

    setValue('permissions', newPermissions);
    setPermissions(data);

    trigger('permissions').then((valid) => {
      if (!valid && newPermissions.length === 0) {
        toast.error('At least one permission is required', {
          duration: 2000,
          position: 'top-right',
        });
      }
    });
  };

  const handleNextStep = async () => {
    const isStepValid = await trigger(formStep === 0 ? 'name' : 'permissions');
    if (isStepValid) {
      setFormStep((prev) => prev + 1);
    } else if (formStep === 1) {
      const permissionsArray = watch('permissions') || [];
      if (permissionsArray.length === 0) {
        toast.error('At least one permission is required', {
          duration: 2000,
          position: 'top-right',
        });
      }
    }
  };

  const handlePreviousStep = () => setFormStep((prev) => prev - 1);
  const handleStepChange = async (step: number) => {
    if (step > formStep) {
      const fieldsToValidate = formStep === 0 ? 'name' : 'permissions';
      const isStepValid = await trigger(fieldsToValidate);
      if (isStepValid) {
        setFormStep(step);
      } else if (formStep === 1) {
        const permissionsArray = watch('permissions') || [];
        if (permissionsArray.length === 0) {
          toast.error('At least one permission is required', {
            duration: 2000,
            position: 'top-right',
          });
        }
      }
    } else {
      setFormStep(step);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const payload = {
      name: data.name,
      permissions: data.permissions,
    };

    const action = isEditMode ? 'Edit' : 'Create';

    try {
      isEditMode
        ? await putAPI(`roles/${role.id}`, payload)
        : await postAPI('roles', payload);

      toast.success(`Role successfully ${action.toLowerCase()}ed`, {
        duration: 1000,
        position: 'top-right',
      });

      setFormStep(0);
      setOpen(null);
      setIsLoading(false);
      setRender((previous: boolean) => !previous);
    } catch (error: any) {
      const errorMessage =
        error.errors?.name?.[0] ||
        error.errors?.permissions?.[0] ||
        `Failed to ${action.toLowerCase()} role`;

      toast.error(errorMessage, {
        duration: 1000,
        position: 'top-right',
      });
      setIsLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(onSubmit)}>
      <Box flexShrink="0">
        <Drawer.Header>
          <Drawer.Title>
            {isEditMode ? 'Edit Role' : 'Create new role'}
          </Drawer.Title>
          <X
            size={20}
            weight="bold"
            cursor="pointer"
            onClick={() => setOpen(false)}
          />
        </Drawer.Header>
        <StepsIndicator
          titles={['Details', 'Permissions']}
          formStep={formStep}
          goTo={handleStepChange}
        />
      </Box>
      <Box flex={1} overflowY="auto" px="xl" py="md">
        <Box display={formStep === 0 ? 'block' : 'none'}>
          <Field
            label="Role Name"
            required
            error={errors?.name?.message as string}>
            <InputText
              {...register('name', { required: true })}
              placeholder="Enter a Role Name"
            />
          </Field>
        </Box>
        <Box display={formStep === 1 ? 'block' : 'none'}>
          <Box>
            <Label htmlFor="search">Permissions</Label>
            <InputText
              type="search"
              placeholder="Search by"
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Flex
            direction="column"
            my="lg"
            border="1px solid"
            borderColor="border"
            borderRadius="sm">
            {filteredPermissionKeys.map((key, index) => {
              const dropped = isExpanded === index;
              return (
                <DisclosureProvider key={index}>
                  <Box>
                    <StyledDisclosure
                      onClick={() => {
                        if (isExpanded === index) setExpanded(null);
                        else setExpanded(index);
                      }}>
                      <Flex w="100%" justify="space-between" align="center">
                        <Label
                          display="flex"
                          maxWidth="max-content"
                          alignItems="center"
                          mb="0">
                          <Checkbox
                            checked={permissions[key]?.isChecked || false}
                            indeterminate={
                              !permissions[key]?.children.every(
                                (child: any) => child.isChecked,
                              ) &&
                              permissions[key]?.children.some(
                                (child: any) => child.isChecked,
                              )
                            }
                            onChange={(e: any) =>
                              handleParentCheckboxChange(
                                e,
                                permissions[key].name,
                              )
                            }
                          />
                          <Text textTransform="capitalize" variant="base">
                            {permissions[key].name}
                          </Text>
                        </Label>
                        <IconWrapper dropped={dropped} className="icon">
                          <DownIcon width="18px" />
                        </IconWrapper>
                      </Flex>
                    </StyledDisclosure>
                    <DisclosureContent>
                      <Box>
                        {permissions[key].children.map((sub: any) => (
                          <Box key={sub.id}>
                            <StyledLabel>
                              <Checkbox
                                checked={sub.isChecked}
                                onChange={(e: any) => {
                                  handleChildCheckboxChange(
                                    e,
                                    permissions[key].name,
                                    sub.id,
                                  );
                                }}
                              />
                              <Text textTransform="capitalize" color="gray.800">
                                {sub.action}
                              </Text>
                            </StyledLabel>
                          </Box>
                        ))}
                      </Box>
                    </DisclosureContent>
                  </Box>
                </DisclosureProvider>
              );
            })}
          </Flex>
          {errors?.permissions?.message && (
            <Text color="danger" fontSize="sm" mt="2">
              {errors.permissions.message as string}
            </Text>
          )}
        </Box>
      </Box>
      <Flex flexShrink="0" px="xl" py="md" gap="sm">
        {formStep === 0 && <Button onClick={handleNextStep}>Next</Button>}
        {formStep === 1 && (
          <Button variant="secondary" onClick={handlePreviousStep}>
            Prev
          </Button>
        )}
        {formStep !== 0 && (
          <Button disabled={!isValid} loading={isLoading} type="submit">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
export default RolesForm;
