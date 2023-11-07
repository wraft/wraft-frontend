import React from 'react';
import { ThemeUIStyleObject, Box } from 'theme-ui';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { styles } from './Table';

export interface TableProps {
  data: any;
  columns: any;
}

export const TableNew = ({ data, columns }: TableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box as="table" sx={styles.table}>
      <Box
        as="thead"
        sx={{
          fontSize: 0,
          textTransform: 'uppercase',
          border: '1px solid',
          borderColor: 'neutral.1',
          color: 'gray.3',
        }}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const thSx = {
                ...styles.th,
                // width: flexRender(
                //   header.column.columnDef.width,
                //   header.getContext,
                // ),
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

export default TableNew;
