/** @jsxImportSource theme-ui */

import { useState, useEffect } from 'react';

import { Checkbox } from '@ariakit/react';
import { svgDataUriTickWhiteProped } from '@wraft-ui/UriSvgs';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Text, Button, Box, Label } from 'theme-ui';

import { postAPI } from '../../utils/models';

import { RoleType } from './TeamList';

interface RoleList {
  roleName: string;
  roleId: string;
}

type AssignRoleProps = {
  roles: RoleType[];
  currentRoleList: string[];
  userId: string | null;
  setRerender: any;
};

type FormInputs = {
  roles: string[];
};

const AssignRole = ({
  roles,
  currentRoleList,
  userId,
  setRerender,
}: AssignRoleProps) => {
  const [roleList, setRoleList] = useState<Array<RoleList> | undefined>(
    undefined,
  );
  const [selectedRolesId, setSelectedRolesId] = useState<string[]>([]);

  const { handleSubmit } = useForm<FormInputs>();

  useEffect(() => {
    if (roles) {
      const roleData: (RoleList | undefined)[] = roles.map((role) => {
        if (!currentRoleList.includes(role.id)) {
          return {
            roleName: role.name,
            roleId: role.id,
          };
        }
        return undefined;
      });

      const filteredRoleData = roleData.filter((role) => role !== undefined);

      setRoleList(filteredRoleData as RoleList[]);
    }
  }, [roles]);

  const updateSelectedRoles = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedRolesId((ids) => [...ids, id]);
    } else {
      setSelectedRolesId((prev) => prev.filter((roleId) => roleId !== id));
    }
  };

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    const assignPromises = selectedRolesId.map((role) => {
      return postAPI(`users/${userId}/roles/${role}`, {});
    });
    toast.promise(Promise.all(assignPromises), {
      loading: 'Loading...',
      success: () => {
        setRerender((prev: boolean) => !prev);
        close();
        return `Successfully assigned all roles`;
      },
      error: () => {
        return `Failed to assign all roles`;
      },
    });
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '205px',
        height: '295px',
        overflow: 'hidden',
      }}>
      <Box
        p={3}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'neutral.200',
          width: '100%',
        }}>
        <Text variant="subB" sx={{ color: 'text' }}>
          Choose roles
        </Text>
      </Box>
      {roleList && roleList.length < 1 && (
        <Text variant="pR">No more roles to add.</Text>
      )}
      <Box sx={{ width: '100%', minHeight: '180px', overflow: 'scroll' }}>
        {roleList &&
          roleList.map((role) => (
            <Box key={role.roleId} as={Box} sx={{ width: '100%' }}>
              <Flex>
                <Label
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'border',
                    py: '12px',
                    px: '16px',
                    ':last-of-type': {
                      borderBottom: 'none',
                    },
                  }}>
                  <Checkbox
                    sx={{
                      appearance: 'none',
                      border: '1px solid #D4D7DA',
                      borderRadius: '4px',
                      height: '14px',
                      width: '14px',
                      '&:checked': {
                        display: 'flex',
                        justifyContent: 'center',
                        borderColor: '#343E49',
                        backgroundColor: '#343E49',
                        alignItems: 'center',
                        '&:after': {
                          display: 'block',
                          mt: '2px',
                          content: `url("data:image/svg+xml,${svgDataUriTickWhiteProped(10)}")`,
                        },
                      },
                    }}
                    type="checkbox"
                    onChange={(e) => updateSelectedRoles(e, role.roleId)}
                  />
                  <Text
                    variant="subR"
                    sx={{
                      pl: 1,
                      textTransform: 'capitalize',
                      color: 'text',
                    }}>
                    {role.roleName}
                  </Text>
                </Label>
              </Flex>
            </Box>
          ))}
      </Box>
      <Flex
        sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Button type="submit" variant="base">
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

export default AssignRole;
