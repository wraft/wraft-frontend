import React, { useState, useCallback } from 'react';
import { Box, Flex, Button, InputText } from '@wraft/ui';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
export interface TableRow {
  [key: string]: string;
}

export interface TableColumn {
  id: string;
  name: string;
}

interface TableFieldInputProps {
  value?: TableRow[] | string;
  onChange: (value: TableRow[]) => void;
  columns?: TableColumn[];
  disabled?: boolean;
  smartTableName?: string;
}

const TableFieldInput: React.FC<TableFieldInputProps> = ({
  value,
  onChange,
  columns = [],
  disabled = false,
  smartTableName,
}) => {
  const parseValue = useCallback(() => {
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  }, [value]);

  const [rows, setRows] = useState<TableRow[]>(parseValue());

  const defaultColumns: TableColumn[] =
    columns.length > 0
      ? columns
      : [
          { id: 'col1', name: 'Column 1' },
          { id: 'col2', name: 'Column 2' },
        ];

  const tableColumns = defaultColumns;

  React.useEffect(() => {
    const parsed = parseValue();
    if (JSON.stringify(parsed) !== JSON.stringify(rows)) {
      setRows(parsed);
    }
  }, [value, parseValue]);

  const handleAddRow = useCallback(() => {
    const newRow: TableRow = {};
    tableColumns.forEach((col) => {
      newRow[col.id] = '';
    });
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange(newRows);
  }, [rows, tableColumns, onChange]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
      onChange(newRows);
    },
    [rows, onChange],
  );

  const handleCellChange = useCallback(
    (rowIndex: number, columnId: string, newValue: string) => {
      const newRows = [...rows];
      if (!newRows[rowIndex]) {
        newRows[rowIndex] = {};
      }
      newRows[rowIndex][columnId] = newValue;
      setRows(newRows);
      onChange(newRows);
    },
    [rows, onChange],
  );

  const showSmartTableInfo = smartTableName && smartTableName.trim() !== '';

  if (tableColumns.length === 0) {
    return (
      <Box p="md" bg="gray.50" borderRadius="md">
        <Box color="gray.600">
          {smartTableName
            ? `No columns found for smart table: ${smartTableName}`
            : 'No columns defined for this table'}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {showSmartTableInfo && (
        <Box
          mb="sm"
          p="xs"
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="sm"
          fontSize="sm">
          <Box as="span" fontWeight="medium" color="blue.700">
            Smart Table: {smartTableName}
          </Box>
        </Box>
      )}

      <Box
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        overflow="hidden">
        <Flex bg="gray.50" borderBottom="1px solid" borderColor="border" p="sm">
          {tableColumns.map((col) => (
            <Box
              key={col.id}
              flex="1"
              fontWeight="medium"
              fontSize="sm"
              color="gray.700"
              px="sm">
              {col.name}
            </Box>
          ))}
          {!disabled && (
            <Box style={{ width: '40px', textAlign: 'center' }}></Box>
          )}
        </Flex>

        {rows.length === 0 ? (
          <Box p="md" textAlign="center" color="gray.500">
            No rows yet. Click &quot;Add Row&quot; to start.
          </Box>
        ) : (
          rows.map((row, rowIndex) => (
            <Flex
              key={rowIndex}
              borderBottom="1px solid"
              borderColor="border"
              p="sm"
              alignItems="center">
              {tableColumns.map((col) => (
                <Box key={col.id} flex="1" px="sm">
                  <InputText
                    value={row[col.id] || ''}
                    onChange={(e) =>
                      handleCellChange(rowIndex, col.id, e.target.value)
                    }
                    placeholder={`Enter ${col.name.toLowerCase()}`}
                    disabled={disabled}
                  />
                </Box>
              ))}
              {!disabled && (
                <Box style={{ width: '40px', textAlign: 'center' }}>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => handleRemoveRow(rowIndex)}
                    aria-label="Remove row">
                    <IconFrame color="icon">
                      <TrashIcon size={16} />
                    </IconFrame>
                  </Button>
                </Box>
              )}
            </Flex>
          ))
        )}
      </Box>

      {!disabled && (
        <Box mt="sm">
          <Button variant="tertiary" size="sm" onClick={handleAddRow}>
            <IconFrame color="icon">
              <PlusIcon size={16} />
            </IconFrame>
            <Box as="span">Add Row</Box>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TableFieldInput;
