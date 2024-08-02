import React from 'react';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ThemeUIStyleObject, Box } from 'theme-ui';

import { styles } from './Table';

export interface TableProps {
  data: any;
  columns: any;
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
          fontSize: 'xxs',
          textTransform: 'uppercase',
          border: '1px solid',
          borderColor: 'border',
          color: 'gray.400',
        }}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const thSx = {
                ...styles.th,
              } as ThemeUIStyleObject;
              return (
                <Box as="th" key={header.id} sx={{ ...thSx }}>
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
            <Box
              as="tr"
              key={row.id}
              sx={{
                ...styles.tr,
                border: (row.depth > 0 || row.getIsExpanded()) && 'none',
                backgroundColor: row.depth > 0 && 'background',
                ':hover': {
                  backgroundColor: row.getIsExpanded() && 'transparent',
                },
              }}>
              {row.getVisibleCells().map((cell) => (
                <Box as="th" key={cell.id} sx={styles.td}>
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

export default Table;
