import React, { useEffect, useState } from 'react';
import { Drawer, useDrawer } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';
import { EditIcon } from '@wraft/icon';

import Field from 'components/Field';
import FieldDate from 'components/FieldDate';
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

interface FieldFormProps {
  fields: any;
  onSaved: any;
  setMaps?: any;
  activeTemplate?: any;
  templates?: any;
  setShowForm?: any;
  onRefresh: any;
  fieldValues?: any;
}

const FieldForm = ({
  fields,
  onSaved,
  fieldValues,
  setMaps,
}: FieldFormProps) => {
  const { register, handleSubmit } = useForm();
  const [mappedFields, setMappedFields] = useState<Array<IFieldType>>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const mobileMenuDrawer = useDrawer();

  const mapFields = (
    fields: any,
    fieldValues: Record<string, any>,
  ): FieldInstance[] => {
    return fields.map((field: any) => {
      return {
        ...field,
        value: fieldValues[field.id] || '',
      } as IFieldType;
    });
  };

  const onSubmit = (data: Record<string, any>) => {
    setSubmitting(true);

    const mappedFields = mapFields(fields, data);
    setMappedFields(mappedFields);
    onSaved(mappedFields);

    setSubmitting(false);
    closeDrawer();
  };

  useEffect(() => {
    if (fields) {
      if (fieldValues) {
        const mappedFields = mapFields(fields, fieldValues);
        onSaved(mappedFields);
        setMappedFields(mappedFields);
        setMaps(mappedFields);
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
          sx={{ bg: 'backgroundWhite' }}>
          <Drawer.Title>Update Content</Drawer.Title>
          <Box sx={{ p: 4 }}>
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
                        name={f.id}
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
                Save
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
export default FieldForm;
