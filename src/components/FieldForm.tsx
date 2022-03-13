import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
import { useForm } from 'react-hook-form';

import Field from './Field';
import { Field as FieldT, FieldInstance } from '../utils/types';
import FieldDate from './FieldDate';
import Modal from './Modal';
import { findAll, replaceTitles } from '../utils';

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

const FieldForm = ({ fields, onSaved, setMaps, onRefresh, activeTemplate, setShowForm, templates, showForm }: FieldFormProps) => {
  const { register, handleSubmit, getValues } = useForm();
  const [fieldMap, setFieldMap] = useState<Array<IFieldType>>();
  const [isReady, setIsReady] = useState<Boolean>(false);

  /**
   * Map form values to fields
   * @param fields
   */
  const mapFields = (fields: any) => {
    const vals = getValues();
    let obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function (value: any) {
        const name = vals[`${value.name}`];
        let x: FieldInstance = { ...value, value: name };
        obj.push(x);
      });
    }
    return obj;
  };

  const getInits = (field_maps: any) => {
    let initials: IFieldField[] = [];
    field_maps &&
      field_maps.forEach((i: any) => {
        const item: IFieldField = { name: i.name, value: i.value, id: i?.field_type?.id };
        initials.push(item);
      });
    return initials;
  };

  /**
   * Form Submit
   * @param _data 
   */
  const onSubmit = (_data: any) => {
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
    if(fieldMap && fieldMap[0] && fieldMap[0]?.value){
      console.log('🐴🐴  fields [4.0]', fieldMap)
    }
  }, [fieldMap]);

  function closeModal() {
    setShowForm(false);
  }
  

  const yoFileTha = () => {
    onRefresh(fieldMap);
  }

  return (
    <Box sx={{ p: 3, borderColor: 'gray.1', bg: '#F5F7FE' }}>
      <Box>
        <Text as="h6" variant='labelcaps'>Fields</Text>
      </Box>

      <Box
        p={0}
        sx={{ bg: 'white', mt: 1, mb: 3, border: 'solid 1px', borderColor: 'gray.3' }}>

        {fieldMap &&
          fieldMap.map((x: any) => (
            <Flex
              key={x.id}

              sx={{
                // bg: 'red.3',
                py: 2,
                px: 3,
                borderBottom: 'solid 0.5px',
                borderColor: 'gray.2',
                // mb: 2,
              }}>
              <Text
                sx={{
                  color: '#363e4980',
                  fontSize: '16px',
                  fontWeight: 300,
                }}>
                {x.name}
              </Text>
              <Text
                sx={{
                  fontSize: '16px',
                  // color: 'green.9',
                  ml: 'auto',
                  color: '#363E49',
                  fontWeight: 300,
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
      <Modal isOpen={showForm} onClose={closeModal}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          // py={2}
          sx={{ p: 4, bg: 'gray.0' }}
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
            <Button type="submit">Save</Button>
            <Text onClick={closeModal} pl={2} pt={1}>
              Close
            </Text>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};
export default FieldForm;
