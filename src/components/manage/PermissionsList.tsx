/** @jsxImportSource theme-ui */
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex } from 'theme-ui';
import { loadEntity, updateEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import TableNew from '../TableNew';
import { ArrowDropdown } from '../Icons';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';
import { Checkbox } from '@ariakit/react';

const PermissionsList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const render = React.useRef<any>();
  const { addToast } = useToasts();

  const onSuccess = (data: any) => {
    setPermissionsInitial(data);
  };
  const onSuccessRoles = (data: any) => {
    setRoles(data);
  };

  useEffect(() => {
    if (token) {
      loadEntity(token, 'permissions', onSuccess);
      loadEntity(token, 'roles', onSuccessRoles);
    }
  }, [token]);

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
  }, [permissionsInitial, token, roles]);

  const data = useMemo(() => permissions, [permissions]);

  function onSuccessUpdate() {
    addToast(`Updated Permissions`, { appearance: 'success' });
  }

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
    updateEntity(`roles/${role.id}`, body, token, onSuccessUpdate);
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
    const svgDataUri =
      encodeURIComponent(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/tick">
<path id="Vector" d="M11.7709 3.33641C11.7048 3.26509 11.6261 3.20848 11.5394 3.16985C11.4527 3.13122 11.3597 3.11133 11.2657 3.11133C11.1718 3.11133 11.0788 3.13122 10.9921 3.16985C10.9054 3.20848 10.8267 3.26509 10.7605 3.33641L5.45949 9.01284L3.23235 6.62356C3.16367 6.55262 3.08259 6.49683 2.99375 6.45939C2.90491 6.42195 2.81004 6.40359 2.71457 6.40536C2.61909 6.40712 2.52488 6.42898 2.4373 6.46969C2.34972 6.51039 2.2705 6.56914 2.20416 6.64259C2.13782 6.71603 2.08565 6.80273 2.05064 6.89774C2.01563 6.99274 1.99846 7.09419 2.00011 7.19629C2.00176 7.29839 2.0222 7.39914 2.06027 7.49279C2.09833 7.58645 2.15327 7.67116 2.22195 7.74211L4.95429 10.664C5.02044 10.7353 5.09914 10.792 5.18585 10.8306C5.27256 10.8692 5.36556 10.8891 5.45949 10.8891C5.55343 10.8891 5.64643 10.8692 5.73314 10.8306C5.81985 10.792 5.89855 10.7353 5.96469 10.664L11.7709 4.45495C11.8432 4.3837 11.9008 4.29722 11.9402 4.20096C11.9796 4.10471 12 4.00076 12 3.89568C12 3.7906 11.9796 3.68665 11.9402 3.59039C11.9008 3.49414 11.8432 3.40766 11.7709 3.33641Z" fill="#343E49"/>
</g>
</svg>
  `);
    const svgDataUriWhite =
      encodeURIComponent(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/tick">
<path id="Vector" d="M11.7709 3.33641C11.7048 3.26509 11.6261 3.20848 11.5394 3.16985C11.4527 3.13122 11.3597 3.11133 11.2657 3.11133C11.1718 3.11133 11.0788 3.13122 10.9921 3.16985C10.9054 3.20848 10.8267 3.26509 10.7605 3.33641L5.45949 9.01284L3.23235 6.62356C3.16367 6.55262 3.08259 6.49683 2.99375 6.45939C2.90491 6.42195 2.81004 6.40359 2.71457 6.40536C2.61909 6.40712 2.52488 6.42898 2.4373 6.46969C2.34972 6.51039 2.2705 6.56914 2.20416 6.64259C2.13782 6.71603 2.08565 6.80273 2.05064 6.89774C2.01563 6.99274 1.99846 7.09419 2.00011 7.19629C2.00176 7.29839 2.0222 7.39914 2.06027 7.49279C2.09833 7.58645 2.15327 7.67116 2.22195 7.74211L4.95429 10.664C5.02044 10.7353 5.09914 10.792 5.18585 10.8306C5.27256 10.8692 5.36556 10.8891 5.45949 10.8891C5.55343 10.8891 5.64643 10.8692 5.73314 10.8306C5.81985 10.792 5.89855 10.7353 5.96469 10.664L11.7709 4.45495C11.8432 4.3837 11.9008 4.29722 11.9402 4.20096C11.9796 4.10471 12 4.00076 12 3.89568C12 3.7906 11.9796 3.68665 11.9402 3.59039C11.9008 3.49414 11.8432 3.40766 11.7709 3.33641Z" fill="#ffffff"/>
</g>
</svg>
  `);
    return {
      header: role.name,
      accessorKey: role.name,
      id: role.id,
      cell: ({ row }: any) => (
        // <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box>
          {row.getCanExpand() ? (
            <Checkbox
              sx={{
                appearance: 'none',
                border: '1px solid #D4D7DA',
                borderRadius: '4px',
                height: '20px',
                width: '20px',
                '&:checked': {
                  display: 'flex',
                  justifyContent: 'center',
                  borderColor: '#343E49',
                  backgroundColor: '#343E49',
                  alignItems: 'center',
                  '&:after': {
                    display: 'block',
                    mt: '4px',
                    content: `url("data:image/svg+xml,${svgDataUriWhite}")`,
                  },
                },
              }}
              type="checkbox"
              name="parent"
              checked={permissions[row.index][role.name]}
              onChange={(e: any) => onChangeParent(e, role, row.index)}
            />
          ) : (
            <Checkbox
              sx={{
                appearance: 'none',
                border: '1px solid #D4D7DA',
                borderRadius: '4px',
                height: '20px',
                width: '20px',
                '&:checked': {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#343E49',
                  '&:after': {
                    display: 'block',
                    mt: '4px',
                    content: `url("data:image/svg+xml,${svgDataUri}")`,
                  },
                },
              }}
              type="checkbox"
              name="child"
              checked={
                permissions[row.parentId]?.children[row.index][role.name]
              }
              onChange={(e: any) =>
                onChangeChild(e, role, row.index, row.parentId)
              }
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
        <Box
          sx={{
            paddingLeft: `${row.depth * 2}rem`,
          }}>
          {row.getCanExpand() ? (
            <Button
              variant="base"
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer', width: '100%' },
              }}>
              <Flex sx={{ gap: '8px' }}>
                <Box>{getValue()}</Box>
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
            <Box>{getValue()}</Box>
          )}
        </Box>
      ),
    },
    ...ColumnRoles,
  ];

  return (
    <Flex sx={{ width: '100%' }} ref={render}>
      <TableNew data={data} columns={columns} />
    </Flex>
  );
};
export default PermissionsList;
