import React from 'react';
import { ThemeUIStyleObject, Box } from 'theme-ui';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { styles } from './Table';

export interface TableProps {
  data: any;
  columns: any;
}
// export const styles = {
//   table: {
//     borderCollapse: 'collapse',
//     width: '100%',
//     border: '1px solid',
//     borderColor: 'neutral.1',
//     textAlign: 'left',
//     bg: 'bgWhite',
//   } as ThemeUIStyleObject,
//   thead: {
//     bg: 'gray.0',
//     fontSize: 0,
//     textTransform: 'uppercase',
//     border: '1px solid',
//     borderColor: 'neutral.1',
//     color: 'gray.1',
//   },
//   tr: {
//     verticalAlign: 'top',
//     // bg: 'gray.0',
//     borderBottom: '1px solid',
//     borderBottomColor: 'neutral.1',
//     '&:last-child': {
//       border: '0',
//     },
//     '&:hover': {
//       bg: 'background',
//     },
//   },
//   th: { p: 2, textAlign: 'left', fontWeight: 'normal' },
//   td: { p: 2 },
// };

export const TableNew = ({ data, columns }: TableProps) => {
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
                <Box as="th" variant="text.subR" key={cell.id} sx={styles.td}>
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
