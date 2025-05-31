import React, { useEffect, useState } from 'react';
import {
  Drawer,
  useDrawer,
  Box,
  Flex,
  Button,
  Text,
  InputText,
  Field,
} from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { EditIcon } from '@wraft/icon';

import FieldDate from 'common/FieldDate';
import { convertToVariableName, mapFields } from 'utils';

import { useDocument } from '../DocumentContext';

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

  const { editorMode, setFieldValues } = useDocument();

  const { register, handleSubmit } = useForm();
  const mobileMenuDrawer = useDrawer();

  const onSubmit = (data: Record<string, any>) => {
    setSubmitting(true);

    const newMappedFields = mapFields(fields, data);
    // const tokens = mapPlaceholdersToFields(placeholders);
    setFieldValues(data);
    setMappedFields(newMappedFields);
    onSaved(newMappedFields);

    setSubmitting(false);
    closeDrawer();
  };

  useEffect(() => {
    if (fields) {
      if (fieldValues) {
        const newMappedFields = mapFields(fields, fieldValues);
        if (editorMode === 'new') {
          onSaved(newMappedFields);
        }
        setMappedFields(newMappedFields);
      }
    }
  }, [fields, fieldValues]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box mt="xl">
      {fieldValues && (
        <>
          <Flex justify="space-between">
            <Text as="h6">Data Fields</Text>
            {editorMode !== 'view' && (
              <Box onClick={openDrawer}>
                <EditIcon width={14} className="main-icon" />
              </Box>
            )}
          </Flex>

          <Box border="1px solid" borderColor="border" mt="sm">
            {mappedFields &&
              mappedFields.map((x: any) => (
                <Flex
                  key={x.id}
                  borderBottom="1px solid"
                  borderColor="border"
                  p="sm">
                  <Text flex="0 0 60%" fontWeight="heading">
                    {x.value}
                  </Text>
                  <Text
                    flex="0 0 40%"
                    color="text-secondary"
                    fontWeight="heading"
                    textTransform="capitalize"
                    textAlign="right">
                    {x.name}
                  </Text>

                  {/* <Text>{x.type}</Text> */}
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
          bg="background-primary"
          p="md"
          onSubmit={handleSubmit(onSubmit)}>
          <Drawer.Header>
            <Drawer.Title>Placeholder</Drawer.Title>
          </Drawer.Header>
          <Box p="md">
            {mappedFields && mappedFields.length > 0 && (
              <Box>
                {mappedFields.map((f: IFieldType) => (
                  <Box key={f.id} pb="sm">
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
                      <Field label={f.name} required>
                        <InputText
                          placeholder=""
                          defaultValue={f.value}
                          {...register(convertToVariableName(f.name))}
                        />
                      </Field>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            <Flex pt="md">
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
