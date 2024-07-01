/** @jsxImportSource theme-ui */

import { useState, useEffect } from 'react';
import Checkbox from '@wraft-ui/Checkbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Text, Button, Box, Label } from 'theme-ui';

import { postAPI } from 'utils/models';

import { RoleType } from './TeamList';

interface RoleList {
  roleName: string;
  roleId: string;
}

type AssignRoleProps = {
  roles: RoleType[];
  setIsAssignRole: any;
  currentRoleList: string[];
  userId: string | null;
  setRerender: any;
};

type FormInputs = {
  roles: string[];
};

const AssignRole = ({
  roles,
  setIsAssignRole,
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

  const onSubmit = () => {
    const assignPromises = selectedRolesId.map((role) => {
      return postAPI(`users/${userId}/roles/${role}`, {});
    });
    toast.promise(Promise.all(assignPromises), {
      loading: 'Loading...',
      success: () => {
        setRerender((prev: boolean) => !prev);
        setIsAssignRole(null);
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
                    size={'small'}
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
      <Button
        type="submit"
        variant="base"
        sx={{
          mt: 'auto',
          width: '100%',
          height: '46px',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'neutral.200',
        }}>
        <Text variant="pB" sx={{ color: 'green.700' }}>
          Save
        </Text>
      </Button>
    </Flex>
  );
};

export default AssignRole;
