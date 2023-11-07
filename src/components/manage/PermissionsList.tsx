import React, { HTMLProps, useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, ThemeUIStyleObject } from 'theme-ui';
import { loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';

//style
import { styles } from '../Table';

// export interface RolesItem {
//   id: string;
//   name: string;
//   permissions?: string[];
//   user_count: number;
// }

export interface TableProps {
  data: any;
  columns: any;
}

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

export const Table = ({ data, columns }: TableProps) => {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    // getSubRows: (row: any) => row.subRows,
    getSubRows: (row: any) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <Box as="table" sx={styles.table}>
      <Box
        as="thead"
        sx={{
          fontSize: -1,
          textTransform: 'uppercase',
          border: '0px solid',
          borderColor: 'neutral.0',
          color: 'gray.2',
        }}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const thSx = {
                ...styles.th,
                // width: header.column.columnDef.width,
                // minWidth: header.column.columnDef.minWidth,
                // maxWidth: header.column.columnDef.maxWidth,
              } as ThemeUIStyleObject;
              return (
                <Box as="th" key={header.id} sx={thSx}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Box as="tbody">
        {table.getRowModel().rows.map((row) => {
          return (
            <Box as="tr" key={row.id} sx={styles.tr}>
              {row.getVisibleCells().map((cell) => (
                <Box as="th" variant="text.subR" key={row.id} sx={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// type Children = {
//   action: string;
//   id: string;
//   name: string;
// };
// type Result = {
//   id: number;
//   name: string;
//   children: Children[];
// };

const PermissionsList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [permissionsInitial, setPermissionsInitial] = useState<any>({});
  const [permissions, setPermissions] = useState<any>([]);

  const onSuccess = (data: any) => {
    setPermissionsInitial(data);
    console.log(data);
  };

  useEffect(() => {
    if (token) loadEntity(token, 'permissions', onSuccess);
  }, [token]);

  const result: any[] = Object.entries(permissionsInitial).map(
    ([key, value], index) => {
      return { id: index, name: key, children: value };
    },
  );

  const newFormat = Object.fromEntries(
    Object.entries(permissionsInitial).map(
      ([category, datas]: [any, any[]]) => [
        category,
        {
          name: category,
          isChecked: false,
          children: datas.map((data: any) => ({ ...data, isChecked: false })),
        },
      ],
    ),
  );

  useEffect(() => {
    setPermissions(result);
    console.log('brrrr', newFormat);
    console.log('ddddddddd', result);
  }, [permissionsInitial]);

  const data = useMemo(() => permissions, [token]);

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      // accessorFn: (row: any) => row.name,
      cell: ({ row, getValue }: any) => (
        <div
          style={{
            paddingLeft: `${row.depth * 2}rem`,
          }}>
          {/* <> */}
          {/* <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />{' '} */}
          {/* {row.getCanExpand() && */}
          <Button
            variant="base"
            // onKeyDown={...onClick}
            {...{
              onClick: row.getToggleExpandedHandler(),
              // onKeyDown:
              style: { cursor: 'pointer' },
            }}>
            {getValue()}
            {/* {row.getIsExpanded() ? '👇' : '👉'} */}
            {row.getIsExpanded()}
          </Button>
          {/* } */}
          {/* {getValue()} */}
          {/* </> */}
        </div>
      ),
    },
  ];

  return (
    <Flex sx={{ width: '100%' }}>
      <Table data={data} columns={columns} />
    </Flex>
  );
};
export default PermissionsList;
