import { Flex, Text, Button } from 'theme-ui';
import { useState, useEffect } from 'react';
import { fetchAPI, postAPI } from '../../utils/models';
import toast from 'react-hot-toast';

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
};

const AssignRole = ({
  currentRoleList,
  setCurrentRoleList,
  setIsAssignRole, // userId,
  userId,
}: AssignRoleProps) => {
  const [response, setResponse] = useState<ResponseData>();
  console.log(response);
  const [roleList, setRoleList] = useState<Array<any>>([]);

  const loadDataSuccess = (data: any) => {
    setResponse(data);
    // console.log(data);
  };
  // console.log(currentRoleList);

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
        .then((data) => {
          console.log('assigned role', data);
          toast.success('Assigned Role Successfully', {
            duration: 2000,
            position: 'top-center',
          });
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentRoleList(null);
      setIsAssignRole(null);
    }
  };

  return (
    <Flex
      sx={{
        width: '205px',
        padding: '15px',
        textDecoration: 'none',
        flexDirection: 'column',
      }}>
      <Text sx={{ color: 'dark_300' }}>Choose role</Text>
      <Flex sx={{ listStyleType: 'none', flexDirection: 'column' }}>
        {roleList.map((role) => (
          <Flex
            key={role.roleId}
            sx={{ py: '10px', color: 'dark_600', fontWeight: 'heading' }}>
            <Button
              onClick={() => assignRoleFunction(role.roleId)}
              sx={{
                cursor: 'pointer',
                margin: '0px',
                padding: '0px',
                color: '#000',
                bg: 'transparent',
                ':disabled': {
                  display: 'none',
                },
              }}>
              {role.roleName}
            </Button>
          </Flex>
        ))}
      </Flex>
      <Button
        onClick={() => {
          setCurrentRoleList(null);
          setIsAssignRole(null);
        }}
        sx={{
          cursor: 'pointer',
          margin: '0px',
          padding: '0px',
          bg: '#000',
          color: '#fff',
          ':disabled': {
            display: 'none',
          },
        }}>
        Close
      </Button>
    </Flex>
  );
};

export default AssignRole;
