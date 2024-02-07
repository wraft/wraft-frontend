/** @jsxImportSource theme-ui */

import React, { useEffect, useMemo, useState } from 'react';

import IndeterminateCheckbox from '@wraft-ui/IndeterminateCheckbox';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { Box, Button, Flex, Text } from 'theme-ui';

import { putAPI, fetchAPI } from '../../utils/models';
import { ArrowDropdown } from '../Icons';
import Table from '../TanstackTable';

const PermissionsList = () => {
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const render = React.useRef<any>();

  useEffect(() => {
    fetchAPI('permissions').then((data: any) => {
      setPermissionsInitial(data);
    });

    fetchAPI('roles').then((data: any) => {
      setRoles(data);
    });
  }, []);

  useEffect(() => {
    //normalize
    const data: any[] = Object.entries(permissionsInitial).map(
      ([key, value], index) => {
        return { id: index, name: key, children: value };
      },
    );

    //adding roles
    const Data: any = data.map((item) => {
      const newItem = roles.map((role: any) => {
        const newChildren = item.children.map((child: any) => {
          const rolecheck = role.permissions.includes(child.name);
          return {
            //swapping name and action because subRow is looking for name
            name: child.action,
            action: child.name,
            [role?.name]: rolecheck,
          };
        });
        return {
          ...item,
          children: newChildren,
        };
      });
      return _.merge.apply(null, newItem);
    });

    // adding parent role check
    const updatedData = Data.map((item: any) => {
      const newItem = roles.map((role: any) => {
        const isAllSelected = item.children.every(
          (child: any) => child[role.name] === true,
        );
        if (isAllSelected) {
          return {
            ...item,
            [role?.name]: true,
          };
        } else {
          return {
            ...item,
            [role?.name]: false,
          };
        }
      });
      return _.merge.apply(null, newItem);
    });

    setPermissions(updatedData);
  }, [permissionsInitial, roles]);

  const data = useMemo(() => permissions, [permissions]);

  const checkedValuesFunc = (permissionsList: string[], role: any) => {
    permissions.forEach((item: any) => {
      item.children.forEach((child: any) => {
        if (child[role.name] === true) {
          //swapped name to action
          permissionsList.push(child.action);
        }
      });
    });
  };

  const onSubmit = (role: any) => {
    const permissionsList: string[] = [];
    checkedValuesFunc(permissionsList, role);
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
  };

  const onChangeParent = (e: any, role: any, index: any) => {
    const { checked } = e.target;
    const data = [...permissions];

    data[index][role.name] = checked;

    if (data[index][role.name]) {
      data[index].children.map((child: any) => (child[role.name] = checked));
    } else {
      data[index].children.map((child: any) => (child[role.name] = false));
    }

    setPermissions(data);
    onSubmit(role);
  };

  const onChangeChild = (
    e: any,
    role: any,
    childIndex: any,
    parentIndex: any,
  ) => {
    const { checked } = e.target;
    const data = [...permissions];

    data[parentIndex].children[childIndex][role.name] = checked;
    data[parentIndex].children.map(() => {
      const isAllSelected = data[parentIndex].children.every(
        (child: any) => child[role.name] === true,
      );
      if (isAllSelected) {
        data[parentIndex][role.name] = checked;
      } else {
        data[parentIndex][role.name] = false;
      }
    });

    setPermissions(data);
    onSubmit(role);
  };

  useEffect(() => {
    render;
  }, [permissions]);

  const ColumnRoles = roles.map((role: any) => {
    return {
      header: role.name,
      accessorKey: role.name,
      id: role.id,
      cell: ({ row }: any) => (
        <Box>
          {row.getCanExpand() ? (
            <IndeterminateCheckbox
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
              }}
              variant={row.getCanExpand() ? 'dark' : 'white'}
            />
          ) : (
            <IndeterminateCheckbox
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
      header: 'Name',
      accessorKey: 'name',
      id: 'name',
      cell: ({ row, getValue }: any) => (
        <Box>
          {row.getCanExpand() ? (
            <Button
              variant="base"
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer', width: '100%' },
              }}>
              <Flex sx={{ gap: '8px' }}>
                <Text variant="pM" sx={{ color: 'text' }}>
                  {getValue()}
                </Text>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transform: row.getIsExpanded()
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                  }}>
                  <ArrowDropdown />
                </Box>
              </Flex>
            </Button>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 2,
              }}>
              <Text variant="pM" sx={{ color: 'text' }}>
                {getValue()}
              </Text>
            </Box>
          )}
        </Box>
      ),
    },
    ...ColumnRoles,
  ];

  return (
    <Flex sx={{ width: '100%' }} ref={render}>
      <Table data={data} columns={columns} />
    </Flex>
  );
};
export default PermissionsList;
