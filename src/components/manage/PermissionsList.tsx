import React, { HTMLProps, useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex } from 'theme-ui';
import { loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import TableNew from '../TableNew';

const PermissionsList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [rolesInitial, setRolesInitial] = useState<any>([]);
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

  useEffect(() => {
    const result: any[] = Object.entries(permissionsInitial).map(
      ([key, value], index) => {
        return { id: index, name: key, children: value };
      },
    );
    setPermissions(result);
  }, [permissionsInitial, token]);

  const data = useMemo(() => permissions, [permissions]);

  const ColumnRoles = rolesInitial.map((e: any) => {
    return {
      header: e.name,
      accessorKey: e.name,
      id: e.name,
      cell: ({ row }: any) => (
        <Box>
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
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
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Box>{getValue()}</Box>
                <Box>{row.getIsExpanded() ? '🔼' : '🔽'}</Box>
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

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}
