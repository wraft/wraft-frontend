/** @jsxImportSource theme-ui */

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Text, Button, Box, Label } from '@wraft/ui';

import Checkbox from 'common/Checkbox';
import { postAPI } from 'utils/models';

import { RoleType } from './TeamList';

type AssignRoleProps = {
  roles: RoleType[];
  setIsAssignRole: any;
  currentMemberRoles: { roleName: string; roleId: string }[];
  userId: string | null;
  setRerender: any;
};

type FormInputs = {
  roles: string[];
};

const AssignRole = ({
  roles,
  setIsAssignRole,
  currentMemberRoles,
  userId,
  setRerender,
}: AssignRoleProps) => {
  const [selectedRolesId, setSelectedRolesId] = useState<string[]>([]);

  const { handleSubmit } = useForm<FormInputs>();

  const currentRoleIds = useMemo(
    () => currentMemberRoles.map((role) => role.roleId),
    [currentMemberRoles],
  );
  const roleList = useMemo(() => {
    if (!roles || roles.length === 0) return [];

    return roles
      .filter((role) => !currentRoleIds.includes(role.id))
      .map((role) => ({
        roleName: role.name,
        roleId: role.id,
      }));
  }, [roles, currentRoleIds]);

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
      flexDirection="column"
      alignItems="center"
      minWidth="205px"
      maxHeight="295px"
      overflow="hidden">
      <Box p="3" borderBottom="1px solid" borderColor="neutral.200" w="100%">
        <Text fontWeight="heading">Choose roles</Text>
      </Box>
      {roleList && roleList.length < 1 && (
        <Text py="md">No more roles to add.</Text>
      )}
      <Box w="100%" maxHeight="220px" overflow="auto">
        {roleList &&
          roleList.map((role) => (
            <Box key={role.roleId} as={Box} w="100%">
              <Flex>
                <Label
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'border',
                    py: '12px',
                    px: '16px',
                    width: '100%',
                    ':last-of-type': {
                      borderBottom: 'none',
                    },
                  }}>
                  <Checkbox
                    size="small"
                    onChange={(e) => updateSelectedRoles(e, role.roleId)}
                  />
                  <Text fontSize="lg" pl="1" textTransform="capitalize">
                    {role.roleName}
                  </Text>
                </Label>
              </Flex>
            </Box>
          ))}
      </Box>
      <Button type="submit" variant="primary" fullWidth>
        Save
      </Button>
    </Flex>
  );
};

export default AssignRole;
