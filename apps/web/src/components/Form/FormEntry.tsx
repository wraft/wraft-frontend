import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Spinner,
  InputText,
  Textarea,
  Button,
  Field,
  Select,
} from '@wraft/ui';
import toast from 'react-hot-toast';
import { LogoIcon } from '@wraft/icon';

import { fetchAPI, postAPI } from 'utils/models';

import TableFieldInput, { TableRow } from './TableFieldInput';

const FormEntry = () => {
  const [items, setItems] = useState<any>([]);
  const [initial, setInitial] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const cId: string = router.query.id as string;
  const loadData = (id: string) => {
    setLoading(true);
    fetchAPI(`forms/${id}`)
      .then((data: any) => {
        setFormdata(data);
        const fields = data.fields.map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            type: i.field_type.name,
            fieldTypeId: i.field_type.id,
            required: i.validations.some(
              (val: any) =>
                val.validation.rule === 'required' &&
                val.validation.value === true,
            ),
            value: i.meta?.defaultValue || '',
            smartTableName: i.meta?.smartTableName || undefined,
            tableColumns: i.meta?.tableColumns || undefined,
            defaultValue: i.meta?.defaultValue || undefined,
            values: i.meta?.values || undefined,
          };
        });
        setInitial(fields);
        setItems(fields);
        setLoading(false);
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  const onClear = () => {
    setItems(initial);
  };

  const onValueChange = (e: any, item: any) => {
    const newVal = e.target.value;
    const newItem = {
      ...item,
      value: newVal,
      error:
        newVal.length === 0 && item.required
          ? 'This field is required'
          : undefined,
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onTableValueChange = (item: any, tableValue: TableRow[]) => {
    const newVal = JSON.stringify(tableValue);
    const newItem = {
      ...item,
      value: newVal,
      error:
        (tableValue.length === 0 ||
          tableValue.every((row) =>
            Object.values(row).every(
              (cell) => !cell || cell.toString().trim() === '',
            ),
          )) &&
        item.required
          ? 'This field is required'
          : undefined,
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  // Helper function to transform table data to the new format
  const transformTableData = (
    tableRows: Array<Record<string, string>>,
    tableColumns?: Array<{ id: string; name: string }>,
    footer?: string[],
  ): Record<string, any> => {
    const headers =
      tableColumns?.map((col) => col.name) ||
      (tableRows.length > 0 ? Object.keys(tableRows[0]) : []);

    const rows = tableRows.map((row) => {
      if (tableColumns && tableColumns.length > 0) {
        return tableColumns.map((col) => row[col.id] || '');
      }
      return headers.map((header) => {
        return row[header] || '';
      });
    });

    const result: Record<string, any> = {
      type: 'table',
      headers,
      rows,
    };

    if (footer && footer.length > 0) {
      result.footer = footer;
    }

    return result;
  };

  const onSave = () => {
    if (items.some((i: any) => i.value.length === 0 && i.required == true)) {
      const errorsAdded = items.map((i: any) => {
        if (i.value.length === 0 && i.required == true) {
          return { ...i, error: 'This field is required' };
        } else {
          return i;
        }
      });
      setItems(errorsAdded);
      return;
    }
    const fields = items.map((i: any) => {
      let value: any = i.value;

      if (i.type === 'Table' && typeof i.value === 'string') {
        try {
          const parsed = JSON.parse(i.value);
          if (Array.isArray(parsed)) {
            const transformed = transformTableData(parsed, i.tableColumns);
            value = transformed;
          } else if (typeof parsed === 'object' && parsed !== null) {
            if (parsed.headers && parsed.rows) {
              value = parsed;
            } else if (Array.isArray(parsed.rows)) {
              const transformed = transformTableData(
                parsed.rows,
                i.tableColumns,
                parsed.footer,
              );
              value = transformed;
            } else {
              value = parsed;
            }
          }
        } catch {
          value = i.value;
        }
      }

      return {
        value,
        field_id: i.id,
      };
    });
    const data = {
      data: fields,
    };

    postAPI(`forms/${cId}/entries`, data)
      .then(() => {
        toast.success('Submitted Successfully');
        onClear();
      })
      .catch((err) => {
        if (err.errors == 'No mappings found')
          toast.error('Pipeline configuration incompleted');
      });
  };

  useEffect(() => {
    if (cId && cId.length > 0) loadData(cId);
  }, [cId]);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box bg="background-secondary" minH="100vh">
      <Box position="absolute" top="1rem" left="1rem">
        <LogoIcon width="120px" height="30px" />
      </Box>
      <Flex p="md" align="center" justify="center" pt="md">
        <Box maxW="80ch" w="100%">
          <>
            <Box w="100%" h="4px" bg="green.700" />
            <Box
              bg="white"
              p="md"
              border="1px solid"
              borderTop="none"
              borderColor="border">
              <Text variant="xl" fontWeight="medium">
                {formdata?.name || 'name'}
              </Text>
              <Text variant="base" mt="3" color="gray.600">
                {formdata?.description || 'description'}
              </Text>
            </Box>
          </>
          <Box mt="md" bg="white" border="1px solid" borderColor="border">
            {items.map((item: any) => (
              <Box
                key={item.id}
                p="md"
                borderBottom="1px solid"
                borderColor="border">
                <Field
                  label={item.name}
                  required={item.required}
                  error={item.error}>
                  <>
                    {item.type === 'Text' && (
                      <Textarea
                        value={item.value}
                        onChange={(e) => onValueChange(e, item)}
                      />
                    )}
                    {item.type === 'String' && (
                      <InputText
                        value={item.value}
                        onChange={(e) => onValueChange(e, item)}
                      />
                    )}
                    {item.type === 'File Input' && (
                      <InputText
                        type="file"
                        value={item.value}
                        onChange={(e) => onValueChange(e, item)}
                      />
                    )}
                    {item.type === 'Date' && (
                      <InputText
                        type="date"
                        value={item.value}
                        onChange={(e) => onValueChange(e, item)}
                      />
                    )}
                    {item.type === 'Table' && (
                      <TableFieldInput
                        value={item.value}
                        onChange={(tableValue) =>
                          onTableValueChange(item, tableValue)
                        }
                        columns={item.tableColumns}
                        smartTableName={item.smartTableName}
                      />
                    )}
                    {(item.type === 'Drop Down' ||
                      item.type === 'Radio Button') &&
                      item.values &&
                      item.values.length > 0 && (
                        <Select
                          key={`${item.id}-${item.value || 'empty'}-${item.values.map((v: any) => v.name).join(',')}`}
                          options={item.values.map((val: any) => ({
                            value: val.name,
                            label: val.name,
                          }))}
                          value={item.value || undefined}
                          onChange={(selectedValue: any) => {
                            const newVal = selectedValue || '';
                            const newItem = {
                              ...item,
                              value: newVal,
                              error:
                                newVal.length === 0 && item.required
                                  ? 'This field is required'
                                  : undefined,
                            };
                            const newArr = items.map((s: any) => {
                              if (s.id === item.id) {
                                return newItem;
                              } else {
                                return s;
                              }
                            });
                            setItems(newArr);
                          }}
                          placeholder="Select an option"
                        />
                      )}
                  </>
                </Field>
              </Box>
            ))}
          </Box>
          <Flex p="md" pl="0" gap="md">
            <Button onClick={onSave}>Save</Button>
            <Button variant="secondary" onClick={onClear}>
              Clear
            </Button>
          </Flex>
          <Text variant="base" mt="md">
            This content is created by the owner of the form. The data you
            submit will be sent to the form owner. Wraft is not responsible for
            the privacy or security practices of its customers, including those
            of this form owner. Never give out your password.
          </Text>
          <Text variant="base" mt="md">
            Powered by{' '}
            <Text as="span" fontWeight="bold">
              Wraft Forms
            </Text>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default FormEntry;
