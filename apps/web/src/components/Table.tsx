/* eslint react/jsx-key: 0 */
import React from 'react';

import { PluginHook, useTable, UseTableOptions } from 'react-table';
import { ThemeUIStyleObject, Box } from 'theme-ui';
export * from 'react-table';

export const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    border: '1px solid',
    borderColor: 'border',
    textAlign: 'left',
    bg: 'backgroundWhite',
  } as ThemeUIStyleObject,
  thead: {
    bg: 'gray.100',
    fontSize: 0,
    textTransform: 'uppercase',
    border: '1px solid',
    borderColor: 'border',
    color: 'gray.200',
  },
  tr: {
    verticalAlign: 'top',
    // bg: 'gray.100',
    borderBottom: '1px solid',
    borderBottomColor: 'neutral.200',
    '&:last-child': {
      border: '0',
    },
    '&:hover': {
      // bg: 'neutral.200',
      bg: 'background',
    },
  },
  th: { p: 2, textAlign: 'left', fontWeight: 'normal' },
  td: { p: 2 },
};

export interface TableProps {
  options: UseTableOptions<any>;
  plugins?: PluginHook<any>[];
}

export const Table: React.FC<TableProps> = ({ options, plugins }) => {
  const tableInstance = useTable(options, ...(plugins || []));

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // const { thead } = styles;

  return (
    <Box as="table" {...getTableProps()} sx={styles.table}>
      <Box
        as="thead"
        sx={{
          fontSize: 0,
          textTransform: 'uppercase',
          border: '1px solid',
          borderColor: 'border',
          color: 'gray.400',
        }}>
        {/* sx={{...styles.thead}} */}
        {headerGroups.map((headerGroup) => (
          <Box as="tr" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              const thSx = {
                ...styles.th,
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              } as ThemeUIStyleObject;
              return (
                <Box as="th" {...column.getHeaderProps()} sx={thSx}>
                  {column.render('Header')}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Box as="tbody" {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Box as="tr" {...row.getRowProps()} sx={styles.tr}>
              {row.cells.map((cell) => (
                <Box as="th" {...cell.getCellProps()} sx={styles.td}>
                  {cell.render('Cell')}
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

Table.defaultProps = {
  plugins: [],
};

export default Table;
