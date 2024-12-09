import React, { useEffect, useState } from 'react';
import { Drawer, useDrawer } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';
import { EditIcon } from '@wraft/icon';

import FieldDate from 'components/FieldDate';
import Field from 'common/Field';
import { convertToVariableName } from 'utils';
import { FieldInstance } from 'utils/types';

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  id: string;
  meta?: Record<string, any>;
  name: string;
  description?: string | null;
  field_type?: Record<string, any>;
  value: string;
}

interface PlaceholderBlockProps {
  fields: any;
  onSaved: any;
  fieldValues?: any;
}

const PlaceholderBlock = ({
  fields,
  fieldValues,
  onSaved,
}: PlaceholderBlockProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [mappedFields, setMappedFields] = useState<Array<IFieldType>>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { register, handleSubmit } = useForm();
  const mobileMenuDrawer = useDrawer();

  const mapFields = (
    inputFields: any,
    inputFieldValues: Record<string, any>,
  ): FieldInstance[] => {
    return inputFields.map((field: any) => {
      const variableName = convertToVariableName(field.name);
      const fieldValue = inputFieldValues[variableName] ?? '';

      return {
        ...field,
        value: fieldValue,
      } as IFieldType;
    });
  };

  const onSubmit = (data: Record<string, any>) => {
    setSubmitting(true);

    const newMappedFields = mapFields(fields, data);
    setMappedFields(newMappedFields);
    onSaved(newMappedFields);

    setSubmitting(false);
    closeDrawer();
  };

  useEffect(() => {
    if (fields) {
      if (fieldValues) {
        const newMappedFields = mapFields(fields, fieldValues);
        onSaved(newMappedFields);
        setMappedFields(newMappedFields);
      }
    }
  }, [fields, fieldValues]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box sx={{ p: 3, borderColor: 'border', bg: 'neutral.100' }}>
      {fieldValues && (
        <>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Text as="h6" variant="labelcaps" sx={{ mb: 2 }}>
              Fields
            </Text>
            <Box onClick={openDrawer}>
              <EditIcon width={18} />
            </Box>
          </Flex>

          <Box
            p={0}
            sx={{
              bg: 'white',
              mt: 1,
              mb: 3,
              border: 'solid 1px',
              borderColor: 'border',
            }}>
            {mappedFields &&
              mappedFields.map((x: any) => (
                <Flex
                  key={x.id}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: 'solid 0.5px',
                    borderColor: 'border',
                  }}>
                  <Text
                    sx={{
                      color: 'text',
                      fontSize: 'sm',
                      fontWeight: 300,
                      flex: '0 0 40%',
                    }}>
                    {x.name}
                  </Text>
                  <Text
                    sx={{
                      fontSize: 'sm',
                      fontWeight: 'bold',
                      ml: 'auto',
                      color: 'text',
                    }}>
                    {x.value}
                  </Text>
                  <Text>{x.type}</Text>
                </Flex>
              ))}
          </Box>
        </>
      )}

      <Drawer
        open={isDrawerOpen}
        store={mobileMenuDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={closeDrawer}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ bg: 'backgroundWhite', px: 4 }}>
          <Drawer.Title>Placeholder</Drawer.Title>
          <Box sx={{ pb: 4 }}>
            {mappedFields && mappedFields.length > 0 && (
              <Box>
                {mappedFields.map((f: IFieldType) => (
                  <Box key={f.id} sx={{ pb: 2 }}>
                    {f.field_type?.name === 'date' && (
                      <FieldDate
                        name={f.id}
                        label={f.name}
                        register={register}
                        sub="Date"
                        onChange={() => console.log('x')}
                      />
                    )}

                    {f.field_type?.name !== 'date' && (
                      <Field
                        name={convertToVariableName(f.name)}
                        label={f.name}
                        defaultValue={f.value}
                        register={register}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
            <Flex sx={{ pt: 3 }}>
              <Button type="submit" disabled={submitting}>
                Update
              </Button>
              <Text onClick={closeDrawer} pl={2} pt={1}>
                Close
              </Text>
            </Flex>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default PlaceholderBlock;
