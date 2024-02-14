import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Box } from 'theme-ui';

interface TableProps {
  data: any;
  columns: any;
}

const Table = ({ data, columns }: TableProps) => {
  const { getHeaderGroups, getRowModel, getState, options } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  console.log('options', options);

  return (
    <Box className="table-container">
      <Box
        as="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid',
          borderColor: 'border',
        }}>
        <Box as="thead">
          {getHeaderGroups().map((headerGroup: any) => (
            <Box
              as="tr"
              key={headerGroup.id}
              sx={{ textAlign: 'left', py: '12px', px: '24px' }}>
              {headerGroup.headers.map((header: any) => (
                <Box
                  as="th"
                  key={header.id}
                  sx={{
                    py: '12px',
                    px: '24px',
                    borderBottom: '1px solid',
                    borderColor: 'border',
                    fontFamily: 'body',
                    fontWeight: 'heading',
                    fontSize: '12px',
                    color: '#A5ABB2',
                    minWidth: header.getSize(),
                  }}>
                  {header.isPlaceholder ? null : (
                    <Box
                      sx={{
                        cursor: header.column.getCanSort()
                          ? 'pointer'
                          : 'default',
                        '&:hover': {
                          color: header.column.getCanSort()
                            ? 'primary'
                            : 'inherit',
                        },
                      }}
                      onClick={header.column.getToggleSortingHandler()}>
                      <Box
                        as="span"
                        className="dddd"
                        sx={{
                          transform: header.column.getIsResizing()
                            ? `translateX(${
                                (options.columnResizeDirection === 'rtl'
                                  ? -1
                                  : 1) *
                                (getState().columnSizingInfo.deltaOffset ?? 0)
                              }px)`
                            : '',
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Box>
                      {header.column.getCanSort() && (
                        <Box as="span">
                          {header.column.getIsSorted() === 'asc' && ' 🔼'}
                          {header.column.getIsSorted() === 'desc' && ' 🔽'}
                          {header.column.getIsSorted() !== 'asc' &&
                            header.column.getIsSorted() !== 'desc' &&
                            ' ⬍'}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box as="tbody">
          {getRowModel().rows.map((row) => {
            return (
              <Box as="tr" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Box
                    as="td"
                    key={cell.id}
                    sx={{
                      py: '15px',
                      px: '24px',
                      borderBottom: '1px solid',
                      borderColor: 'border',
                      minWidth: `${cell.column.getSize()}px`,
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Table;
