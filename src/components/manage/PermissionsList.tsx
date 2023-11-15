import React, {
  HTMLProps,
  //  HTMLProps,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Button, Flex } from 'theme-ui';
import { loadEntity, updateEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import TableNew from '../TableNew';
import { ArrowDropdown } from '../Icons';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';

const PermissionsList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const render = React.useRef<any>();

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
  }, [permissionsInitial, token]);

  const data = useMemo(() => permissions, [permissions]);
  const { addToast } = useToasts();

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

    e.data[index][role.name] = checked;

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
            <input
              type="checkbox"
              checked={permissions[row.index][role.name]}
              onChange={(e: any) => onChangeParent(e, role, row.index)}
            />
          ) : (
            <input
              type="checkbox"
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
