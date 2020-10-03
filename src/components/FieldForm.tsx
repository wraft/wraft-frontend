import React, { useState } from 'react';
import { Box, Flex, Button, Text } from 'rebass';
// import { Label, Input } from '@rebass/forms';

import { useForm } from 'react-hook-form';

import Modal from 'react-modal';
import styled from 'styled-components';
import Field from './Field';
// import { replaceTitles } from '../utils';
import { Field as FieldT, FieldInstance } from '../utils/types';

// import { find } from 'lodash';

const Tag = styled(Box)`
  border: solid 1px #ddd;
  padding: 5px;
  color: #444;
  border-radius: 7px;
  margin-bottom: 8px;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: #ebffe8;
`;

// import

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    minWidth: '55ch',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export interface IFieldField {
  name: string;
  value: string;
}

export interface IFieldType {
  name: string;
  value: string;
  type: string;
}

const Form = (props: any) => {
  const { fields } = props;
  const { register, handleSubmit, getValues } = useForm();
  //   const token = useSelector(({ login }: any) => login.token);
  const [field_maps, setFieldMap] = useState<Array<IFieldType>>();  

  /**
   * Map form values to fields
   * @param fields
   */
  const mapFields = (fields: any) => {
    const vals = getValues();
    let obj: any = [];
    if (fields && fields.length > 0) {
      fields.forEach(function(value: any) {
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
        const item: IFieldField = { name: i.name, value: i.value };
        initials.push(item);
      });
    return initials;
  };

  const onSubmit = (_data: any) => {
    const f: any = mapFields(fields);

    //
    // console.log('Submitted', data);

    setFieldMap(f);
    const vax = getInits(f);
    console.log('Submitted', vax);
    props.setMaps(f);

    const m: string = props.activeTemplate as string;

    if (m && m.length > 0) {
      // const selection = findAll(props.templates, m);
      // // const body: string = selection && (selection.data as string);

      // // srlz
      // const serialized: any = selection && (selection.serialized as string);

      // //
      // if (serialized && serialized.data) {
      //   // console.log('ser', serialized);
      //   const bodyValue = JSON.parse(serialized.data);
      //   console.log('(serialized', bodyValue);

      //   const bodyUpd: ContentState = bodyValue;
      //   const valsAttached = updateVars(bodyUpd, vax);
      //   props.setActive(valsAttached);
      // }

      // // const bodyUpdated: string = replaceVars(body, vax, true);
      // // console.log('bod', data, serialized, bodyUpdated);
      // // props.setActive(data.serialized.data);
      // if (data && data.serialized) {
      //   console.log('x', data.serialized);
      // }

      // Apply title template
      // const newTitle = replaceTitles(selection.title_template, vax);
      // props.setValue('title', newTitle);
    }

    closeModal();
    // hide modal
  };

  function closeModal() {
    props.setShowForm(false);
  }

  return (
    <Box width={1}>
      <Text mb={4} mt={0} variant="caps">
        Fields
      </Text>
      <Box pb={2} pt={3}>
        {field_maps &&
          field_maps.map((x: any) => (
            <Tag key={x.id}>
              {x.name}
              <Text fontSize={0}>{x.type}</Text>
              <Text fontSize={0}>{x.value}</Text>
            </Tag>
          ))}
      </Box>
      <Button sx={{ pt: 2, pb: 2, bg: 'white', color: 'gray',fontFamily: 'heading', border: 'solid 1px', fontSize: 0 }} onClick={props.setShowForm}>Fill Form</Button>
      <Modal
        isOpen={props.showForm}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Example Modal">
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          py={2}
          mt={2}
          width={1}>
          <Text fontSize={2} mb={4}>
            Add Content
          </Text>
          {fields && fields.length > 0 && (
            <Box>
              {fields.map((f: FieldT) => (
                <Box key={f.id}>
                  <Field
                    name={f.name}
                    label={f.name}
                    defaultValue=""
                    register={register}
                  />
                </Box>
              ))}
            </Box>
          )}
          <Flex>
            <Button type="submit">Submit</Button>
            <Text onClick={closeModal} pl={2} pt={1}>
              Close
            </Text>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};
export default Form;
