/** @jsxImportSource theme-ui */

import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Text, Button, Box, Label } from '@wraft/ui';

import Checkbox from 'common/Checkbox';
import { postAPI } from 'utils/models';

import { RoleType } from './TeamList';

type AssignRoleProps = {
  roles: RoleType[];
  setIsAssignRole: (value: number | null) => void;
  currentMemberRoles: { roleName: string; roleId: string }[];
  userId: string | null;
  setRerender: () => void;
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const updateSelectedRoles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const { checked } = e.target;
      setSelectedRolesId((prev) =>
        checked ? [...prev, id] : prev.filter((roleId) => roleId !== id),
      );
    },
    [],
  );

  const onSubmit = useCallback(async () => {
    if (!userId || selectedRolesId.length === 0) {
      toast.error('Please select at least one role to assign');
      return;
    }

    setIsSubmitting(true);

    try {
      const assignPromises = selectedRolesId.map((role) =>
        postAPI(`users/${userId}/roles/${role}`, {}),
      );

      await Promise.all(assignPromises);

      toast.success('Successfully assigned roles', {
        position: 'top-right',
      });

      setRerender();
      setIsAssignRole(null);
    } catch (error) {
      toast.error('Failed to assign roles. Please try again.', {
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, selectedRolesId, setRerender, setIsAssignRole]);

  const handleCancel = useCallback(() => {
    setIsAssignRole(null);
  }, [setIsAssignRole]);

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
        <Text fontWeight="heading" fontSize="md" py="sm" px="md">
          Choose roles
        </Text>
      </Box>

      {roleList.length === 0 ? (
        <Flex
          flex="1"
          align="center"
          justify="center"
          p="md"
          color="text-secondary">
          <Text>No more roles to add.</Text>
        </Flex>
      ) : (
        <Box w="100%" maxHeight="220px" overflow="auto">
          {roleList.map((role) => (
            <Box key={role.roleId} w="100%">
              <Label
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'border',
                  py: 'md',
                  px: 'md',
                  w: '100%',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'gray.50',
                  },
                  '&:last-of-type': {
                    borderBottom: 'none',
                  },
                }}>
                <Checkbox
                  size="small"
                  checked={selectedRolesId.includes(role.roleId)}
                  onChange={(e) => updateSelectedRoles(e, role.roleId)}
                  aria-label={`Select ${role.roleName} role`}
                />
                <Text pl="1" textTransform="capitalize">
                  {role.roleName}
                </Text>
              </Label>
            </Box>
          ))}
        </Box>
      )}

      <Flex p="sm" w="100%" borderTop="1px solid" borderColor="border" gap="sm">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          loading={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting || selectedRolesId.length === 0}
          aria-label={`Assign ${selectedRolesId.length} role${selectedRolesId.length !== 1 ? 's' : ''}`}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default AssignRole;
