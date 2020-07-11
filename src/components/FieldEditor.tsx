import React, { useState } from 'react';
import { Button, Box, Flex, Text } from 'rebass';
import { Label, Input, Select } from '@rebass/forms';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '60%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'scroll',
  },
};

const FieldForm = (props: any) => {
  // console.log('FieldFormProps', props);
  const { register, handleSubmit, getValues } = useForm();
  const [showModal, setModal] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const vals = getValues();
    // console.log('fields', props.fields, vals);

    const results = {
      count: props.fields.size,
      values: vals,
      data: data,
    }

    props.onSave(results)
  };

  function closeModal() {
    setModal(false);
  }

  function toggleModal() {
    setModal(!showModal);
  }

  return (
    <Box pl={4} width={1}>
      <Flex>
        <Text fontSize={1} mb={3}>
          Fields
        </Text>
        <Button variant="small2" onClick={toggleModal}>
          Edit
        </Button>
      </Flex>
      {props.fields.map((f: any) => (
        <Box
          mr={2}
          mb={2}
          p={1}
          pl={3}
          pt={2}
          pb={2}
          sx={{ border: 'solid 1px #eee', bg: 'white' }}>
          <Text fontWeight={500}>{(f && f.value.name) || ''}</Text>
          {console.log('f', f)}
          <Text
            variant="caps"
            pt={1}
            pb={1}
            fontSize={0}
            sx={{ opacity: '0.5' }}>
            {(f && f.value.field_type.name) || 'X'}
          </Text>
        </Box>
      ))}

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          py={3}
          width={1}
          mt={4}
          pr={4}>
          <Text fontSize={2} fontWeight={600} mb={3}>
            Edit Fields
          </Text>
          {props.fields.map((f: any, idx: number) => (
            <Box key={idx}>
              <Flex p={0} pl={0}>
                <Box mr={2} width={7 / 12}>
                  <Label htmlFor="`fields[${idx}][name]`" mb={1}>
                    Name
                  </Label>
                  <Input
                    type="text"
                    ref={register}
                    defaultValue={(f && f.value.name) || ''}
                    name={`fields[${idx}][name]`}
                  />
                </Box>
                <Box width={4 / 12}>
                  <Label htmlFor="`fields[${idx}][type]`" mb={1}>
                    Type
                  </Label>
                  {/* <Input
                  type="text"
                  ref={props.register}
                  defaultValue={(f && f.value) || ''}
                  name={`fields[${idx}][type]`}
                /> */}
                  <Select
                    name={`fields[${idx}][type]`}
                    ref={register}
                    defaultValue={(f && f.value.field_type.id) || ''}>
                    {props.fieldtypes &&
                      props.fieldtypes.length > 0 &&
                      props.fieldtypes.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </Select>
                </Box>
                <Box pt={4} pl={4} width={3 / 12}>
                  <Button
                    variant="small"
                    type="button"
                    onClick={() => props.removeField(idx)}>
                    DEL
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))}
          <Text variant="secondary" type="button" onClick={props.addField}>
            + Add field
          </Text>
          <Button type="submit">Save</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FieldForm;
