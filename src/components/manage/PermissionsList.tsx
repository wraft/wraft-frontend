import React, {
  //  HTMLProps,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Button, Flex } from 'theme-ui';
import { loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import TableNew from '../TableNew';
import { ArrowDropdown } from '../Icons';
import mData from './MOCK.json';

const PermissionsList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [rolesInitial, setRolesInitial] = useState<any>([]);
  // const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);

  const onSuccess = (data: any) => {
    setPermissionsInitial(data);
    console.log(data);
  };
  const onSuccessRoles = (data: any) => {
    setRolesInitial(data);
    console.log(data);
  };

  useEffect(() => {
    if (token) {
      loadEntity(token, 'permissions', onSuccess);
      loadEntity(token, 'roles', onSuccessRoles);
    }
  }, [token]);
  console.log('roleeeee', rolesInitial);

  useEffect(() => {
    const data: any[] = Object.entries(permissionsInitial).map(
      ([key, value], index) => {
        return { id: index, name: key, children: value };
      },
    );
    console.log(data);
    // const renamedData = data.map((item) => {
    //   const newChildren = item.children.map((child: any) => {
    //     return {
    //       name: child.action,
    //       action: child.name,
    //     };
    //   });
    //   return {
    //     ...item,
    //     children: newChildren,
    //   };
    // });
    // setPermissions(renamedData);
    // [{ name: 'superadmin', permissions: ['layout:delete', 'layout:manage'] }];

    // rolesInitial.map((role: any) => {
    //   const renamedData: any = data.map((item) => {
    //     const newChildren = item.children.map((child: any) => {
    //       const rolecheck = role.permissions.includes(child.name);
    //       return {
    //         name: child.action,
    //         action: child.name,
    //         [role?.name]: rolecheck,
    //       };
    //     });
    //     return {
    //       ...item,
    //       children: newChildren,
    //       [role?.name]: false,
    //     };
    //   });
    //   setPermissions(renamedData);
    // });

    // const updatedPermissions = rolesInitial.map((role: any) => {
    //   return data.map((item) => {
    //     const newChildren = item.children.map((child: any) => {
    //       const roleCheck = role.permissions.includes(child.name);
    //       return {
    //         name: child.action,
    //         action: child.name,
    //         [role.name]: roleCheck,
    //       };
    //     });
    //     return {
    //       ...item,
    //       children: newChildren,
    //       [role.name]: false,
    //     };
    //   });
    // });

    // // Merge changes for each role
    // const mergedPermissions = updatedPermissions.reduce(
    //   (acc: any, rolePermissions: any) => {
    //     return acc.map((item: any, index: any) => ({
    //       ...item,
    //       ...rolePermissions[index],
    //     }));
    //   },
    //   data,
    // );

    // setPermissions(mergedPermissions);

    // const updatedPermissions = data.map((item) => {
    //   return rolesInitial.map((role: any) => {
    //     const newChildren = item.children.map((child: any) => {
    //       const roleCheck = role.permissions.includes(child.name);
    //       return {
    //         name: child.action,
    //         action: child.name,
    //         [role.name]: roleCheck,
    //       };
    //     });
    //     return {
    //       ...item,
    //       children: newChildren,
    //       [role.name]: false,
    //     };
    //   });
    // });

    setPermissions(data);

    // setPermissions(finalData);
  }, [permissionsInitial, token]);
  console.log(permissions);

  const data = useMemo(() => permissions, [permissions]);
  // const data = useMemo(() => mData, []);
  console.log(data);

  const ColumnRoles = rolesInitial.map((e: any) => {
    return {
      header: e.name,
      accessorKey: e.name,
      // accessorFn: (row: any) => row.permissions.layout,
      id: e.id,
      // cell: ({ row }: any) => (
      cell: () => (
        <Box>
          {/* <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          /> */}
          <input type="checkbox" />
        </Box>
      ),
    };
  });
  console.log('rolessssss', ColumnRoles);

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      // accessorFn: (row: any) => row[1]?.permissions[1]?.permissions[0].resource,
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
    <Flex sx={{ width: '100%' }}>
      <TableNew data={data} columns={columns} />
    </Flex>
  );
};
export default PermissionsList;

// function IndeterminateCheckbox({
//   indeterminate,
//   className = '',
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = React.useRef<HTMLInputElement>(null!);

//   React.useEffect(() => {
//     if (typeof indeterminate === 'boolean') {
//       ref.current.indeterminate = !rest.checked && indeterminate;
//     }
//   }, [ref, indeterminate, rest.checked]);

//   return (
//     <input
//       type="checkbox"
//       ref={ref}
//       className={className + ' cursor-pointer'}
//       {...rest}
//     />
//   );
// }
