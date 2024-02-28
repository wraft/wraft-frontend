import React, { useEffect, useState } from 'react';
import { Drawer } from '@wraft-ui/Drawer';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';

import Field from 'components/Field';
import FieldDate from 'components/FieldDate';
import { Field as FieldT, FieldInstance } from 'utils/types';
// import { constants } from 'buffer';

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  name: string;
  value: string;
  type?: string;
  id?: any;
}

interface FieldFormProps {
  fields: any;
  onSaved: any;
  setMaps?: any;
  activeTemplate?: any;
  templates?: any;
  setShowForm?: any;
  showForm?: any;
  onRefresh: any;
  fieldValues?: any;
}

const FieldForm = ({
  fields,
  onSaved,
  // setMaps,
  // onRefresh,
  // activeTemplate,
  setShowForm,
  fieldValues,
  // templates,
  showForm,
}: FieldFormProps) => {
  const { register, handleSubmit } = useForm();
  const [mappedFields, setMappedFields] = useState<Array<IFieldType>>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const mapFields = (
    fields: any,
    fieldValues: Record<string, any>,
  ): FieldInstance[] => {
    return fields.map((field: any) => ({
      ...field,
      value: fieldValues[field.name] || '',
    }));
  };

  const onSubmit = (data: Record<string, any>) => {
    setSubmitting(true);

    const mappedFields = mapFields(fields, data);
    setMappedFields(mappedFields);
    onSaved(mappedFields);

    closeModal();
  };

  useEffect(() => {
    if (fields) {
      const mappedFields = mapFields(fields, fieldValues);
      onSaved(mappedFields);
      setMappedFields(mappedFields);
    }
  }, [fields]);

  function closeModal() {
    setShowForm(false);
  }

  // const yoFileTha = () => {
  //   onRefresh(fieldMap);
  // };

  // const updateForm = () => {
  //   console.log('done', fieldMap);
  // };

  return (
    <Box sx={{ p: 3, borderColor: 'border', bg: 'neutral.100' }}>
      <Box>
        <Text as="h6" variant="labelcaps" sx={{ mb: 2 }}>
          Fields
        </Text>
      </Box>

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
                // bg: 'red.400',
                py: 2,
                px: 3,
                borderBottom: 'solid 0.5px',
                borderColor: 'border',
                // mb: 2,
              }}>
              <Text
                sx={{
                  color: 'neutral.800',
                  fontSize: 2,
                  fontWeight: 300,
                }}>
                {x.name}
              </Text>
              <Text
                sx={{
                  fontSize: 2,
                  fontWeight: 'bold',
                  // color: 'green.1000',
                  ml: 'auto',
                  color: 'text',
                  // fontWeight: 300,
                  // fontFamily: 'Menlo, monospace',
                }}>
                {x.value}
              </Text>
              <Text>{x.type}</Text>
            </Flex>
          ))}
      </Box>

      {/* <Box sx={{ display: 'block' }}>
        
      </Box> */}
      <Drawer open={showForm} setOpen={closeModal}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ p: 4, bg: 'backgroundWhite' }}>
          <Text sx={{ fontSize: 2 }}>Add Content</Text>
          {fields && fields.length > 0 && (
            <Box sx={{ pt: 4 }}>
              {fields.map((f: FieldT) => (
                <Box key={f.id} sx={{ pb: 2 }}>
                  {f.field_type.name === 'date' && (
                    <FieldDate
                      name={f.name}
                      label={f.name}
                      register={register}
                      sub="Date"
                      onChange={() => console.log('x')}
                    />
                  )}

                  {f.field_type.name !== 'date' && (
                    <Field
                      name={f.name}
                      label={f.name}
                      defaultValue=""
                      register={register}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
          <Flex sx={{ pt: 3 }}>
            <Button type="submit" disabled={submitting ? true : false}>
              Save
            </Button>
            <Text onClick={closeModal} pl={2} pt={1}>
              Close
            </Text>
          </Flex>
        </Box>
      </Drawer>
    </Box>
  );
};
export default FieldForm;
