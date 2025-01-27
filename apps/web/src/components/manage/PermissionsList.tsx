/** @jsxImportSource theme-ui */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { DownIcon } from '@wraft/icon';
import { Table, Box, Flex, Text } from '@wraft/ui';

import Checkbox from 'common/Checkbox';
import { putAPI, fetchAPI } from 'utils/models';

const PermissionsList = () => {
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const render = React.useRef<any>();

  useEffect(() => {
    Promise.all([fetchAPI('permissions'), fetchAPI('roles')])
      .then(([permissionsData, rolesData]) => {
        reStructurePermission(permissionsData, rolesData);
        setRoles(rolesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const reStructurePermission = (permissionList: any, roleData: any) => {
    const data = Object.entries(permissionList).map(([key, value], index) => ({
      id: index,
      name: key,
      children: value,
    }));

    const dataWithRoles = data.map((item: any) => {
      const newItem = roleData.map((role: any) => {
        const newChildren = item.children.map((child: any) => ({
          name: child.action,
          action: child.name,
          [role.name]:
            role.name === 'superadmin'
              ? true
              : role.permissions.includes(child.name),
        }));
        return {
          ...item,
          children: newChildren,
        };
      });
      return _.merge({}, ...newItem);
    });

    const updatedData = dataWithRoles.map((item: any) => {
      const newItem = roleData.map((role: any) => ({
        ...item,
        [role.name]:
          role.name === 'superadmin'
            ? true
            : item.children.every((child: any) => child[role.name]),
      }));
      return _.merge({}, ...newItem);
    });

    setPermissions(updatedData);
  };

  const data = useMemo(() => permissions, [permissions]);

  const checkedValuesFunc = useCallback(
    (role: any) => {
      return permissions.reduce((acc: string[], item: any) => {
        const rolePermissions = item.children
          .filter((child: any) => child[role.name] === true)
          .map((child: any) => child.action);
        return [...acc, ...rolePermissions];
      }, []);
    },
    [permissions],
  );

  const onSubmit = useCallback(
    (role: any) => {
      const permissionsList = checkedValuesFunc(role);
      const body = {
        name: role.name,
        permissions: permissionsList,
      };
      putAPI(`roles/${role.id}`, body).then(() => {
        toast.success('Updated Permissions', {
          duration: 1000,
          position: 'top-right',
        });
      });
    },
    [checkedValuesFunc],
  );

  const onChangeParent = (e: any, role: any, index: any) => {
    const { checked } = e.target;
    const permissionList = [...permissions];
    permissionList[index][role.name] = checked;

    if (permissionList[index][role.name]) {
      permissionList[index].children.map(
        (child: any) => (child[role.name] = checked),
      );
    } else {
      permissionList[index].children.map(
        (child: any) => (child[role.name] = false),
      );
    }

    setPermissions(permissionList);
    onSubmit(role);
  };

  const onChangeChild = (
    e: any,
    role: any,
    childIndex: any,
    parentIndex: any,
  ) => {
    const { checked } = e.target;
    const permissionList = [...permissions];

    permissionList[parentIndex].children[childIndex][role.name] = checked;
    permissionList[parentIndex].children.map(() => {
      const isAllSelected = permissionList[parentIndex].children.every(
        (child: any) => child[role.name] === true,
      );
      if (isAllSelected) {
        permissionList[parentIndex][role.name] = checked;
      } else {
        permissionList[parentIndex][role.name] = false;
      }
    });

    setPermissions(permissionList);
    onSubmit(role);
  };

  useEffect(() => {
    render;
  }, [permissions]);

  const ColumnRoles = roles.map((role: any) => {
    return {
      header: role.name.toUpperCase(),
      accessorKey: role.name,
      id: role.id,
      enableSorting: false,
      cell: ({ row }: any) => (
        <Box>
          {row.getCanExpand() ? (
            <Checkbox
              {...{
                checked: permissions[row.index][role.name] === true,
                indeterminate:
                  !permissions[row.index].children.every(
                    (child: any) => child[role.name] === true,
                  ) &&
                  permissions[row.index].children.some(
                    (child: any) => child[role.name] === true,
                  ),
                onChange: (e: any) => onChangeParent(e, role, row.index),
                disabled: role.name === 'superadmin',
              }}
              variant={row.getCanExpand() ? 'dark' : 'white'}
            />
          ) : (
            <Checkbox
              name="child"
              checked={
                permissions[row.parentId]?.children[row.index][role.name]
              }
              onChange={(e: any) =>
                onChangeChild(e, role, row.index, row.parentId)
              }
              variant="white"
            />
          )}
        </Box>
      ),
    };
  });

  const columns = [
    {
      header: 'NAME',
      accessorKey: 'name',
      id: 'name',
      cell: ({ row, getValue }: any) => (
        <Box>
          {row.getCanExpand() ? (
            <Box
              variant="base"
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer', width: '100%' },
              }}>
              <Flex sx={{ gap: '8px' }}>
                <Text color="text-primary">{getValue()}</Text>
                <Flex
                  align="center"
                  transform={
                    row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)'
                  }>
                  <DownIcon />
                </Flex>
              </Flex>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 2,
              }}>
              <Text color="text-primary">{getValue()}</Text>
            </Box>
          )}
        </Box>
      ),
    },
    ...ColumnRoles,
  ];

  return (
    <Flex w="100%" ref={render}>
      <Table data={data} columns={columns} isLoading={isLoading} />
    </Flex>
  );
};
export default PermissionsList;
