import { useState, useEffect } from 'react';

import { MenuItem } from '@ariakit/react';
import toast from 'react-hot-toast';
import { Flex, Text, Button } from 'theme-ui';

import { fetchAPI, postAPI } from '../../utils/models';

interface RoleList {
  roleName: string;
  roleId: string;
}
type Role = {
  id: string;
  name: string;
  permissions: string[];
  user_count: number;
};

type ResponseData = Role[];

type AssignRoleProps = {
  currentRoleList: string[];
  setCurrentRoleList: any;
  setIsAssignRole: any;
  userId: string | null;
  setRerender: any;
};

const AssignRole = ({
  currentRoleList,
  setCurrentRoleList,
  setIsAssignRole, // userId,
  userId,
  setRerender,
}: AssignRoleProps) => {
  const [response, setResponse] = useState<ResponseData>();
  const [roleList, setRoleList] = useState<Array<any>>([]);

  const loadDataSuccess = (data: any) => {
    setResponse(data);
  };

  const loadData = () => {
    fetchAPI('roles').then((data: any) => {
      loadDataSuccess(data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (response) {
      const roleData: (RoleList | undefined)[] = response.map((role) => {
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
  }, [response]);

  const assignRoleFunction = async (roleId: string) => {
    if (roleId) {
      postAPI(`users/${userId}/roles/${roleId}`, {})
        .then(() => {
          toast.success('Assigned Role Successfully', {
            duration: 2000,
            position: 'top-center',
          });
          setRerender((prev: boolean) => !prev);
        })
        .catch(() => {
          toast.error('Assigning Role Failed!', {
            duration: 2000,
            position: 'top-center',
          });
        });
      setCurrentRoleList(null);
      setIsAssignRole(null);
    }
  };

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, py: 2 }}>
      {roleList.length < 1 && (
        <Button disabled variant="base" sx={{ color: 'gray.200' }}>
          No more roles to add.
        </Button>
      )}
      {roleList.map((role) => (
        <MenuItem key={role.roleId}>
          <Button
            onClick={() => assignRoleFunction(role.roleId)}
            variant="base"
            sx={{
              cursor: 'pointer',
              my: 2,
              ':hover': { color: 'green.600' },
            }}>
            <Text variant="pL">{role.roleName}</Text>
          </Button>
        </MenuItem>
      ))}
    </Flex>
  );
};

export default AssignRole;
