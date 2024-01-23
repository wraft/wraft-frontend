import React, { useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';

import { Field as FieldT, FieldInstance } from '../utils/types';

import Field from './Field';
import FieldDate from './FieldDate';
// import { constants } from 'buffer';

export interface IFieldField {
  name: string;
  value: string;
  id?: string;
}

export interface IFieldType {
  name: string;
  value: string;
  type: string;
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
}

const FieldForm = ({
  fields,
  onSaved,
  // setMaps,
  // onRefresh,
  // activeTemplate,
  setShowForm,
  // templates,
  showForm,
}: FieldFormProps) => {
  const { register, handleSubmit, getValues } = useForm();
  const [fieldMap, setFieldMap] = useState<Array<IFieldType>>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  // const [isReady, setIsReady] = useState<Boolean>(false);

  /**
   * Map form values to fields
   * @param fields
   */
  const mapFields = (fields: any) => {
    const vals = getValues();
    const obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function (value: any) {
        const name = vals[`${value.name}`];
        const x: FieldInstance = { ...value, value: name };
        obj.push(x);
      });
    }
    return obj;
  };

  const getInits = (field_maps: any) => {
    const initials: IFieldField[] = [];
    field_maps &&
      field_maps.forEach((i: any) => {
        const item: IFieldField = {
          name: i.name,
          value: i.value,
          id: i?.field_type?.id,
        };
        initials.push(item);
      });
    return initials;
  };

  /**
   * Form Submit
   * @param _data
   */
  const onSubmit = () => {
    setSubmitting(true);
    const f: any = mapFields(fields);

    console.log('🌿🎃🎃🌿 Submitted [1]', f);

    setFieldMap(f);
    const simpleFieldMap = getInits(f);
    // console.log('🐴🐴 Submitted [2]', simpleFieldMap);

    onSaved(simpleFieldMap);
    closeModal();
  };

  useEffect(() => {
    // console.log('🐴  fields [3.0]', fields)
  }, [fields]);

  useEffect(() => {
    if (fieldMap && fieldMap[0] && fieldMap[0]?.value) {
      console.log('🐴🐴  fields [4.0]', fieldMap);
    }
  }, [fieldMap]);

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
        {fieldMap &&
          fieldMap.map((x: any) => (
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
          // py={2}
          sx={{ p: 4, bg: 'backgroundWhite' }}
          // mt={2}
        >
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
