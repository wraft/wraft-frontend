import React, { useState } from 'react';
import { Button, Box, Flex, Text } from 'theme-ui';
import { Label, Input, Select } from 'theme-ui';
import Modal from './Modal';
import { useForm } from 'react-hook-form';
import { Trash } from './Icons';

interface FieldFormProps {
  fields?: any;
  fieldtypes?: any;
  addField?: any;
  removeField?: any;
  onSave?: any;
  onClose?: any;
}

const FieldForm = (props: FieldFormProps) => {
  const { register, handleSubmit, getValues } = useForm();
  const [showModal, setModal] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const vals = getValues();
    const results = {
      count: props.fields.size,
      values: vals,
      data: data,
    };

    props.onSave(results);
  };

  function toggleModal() {
    setModal(!showModal);
  }

  function closeModal() {
    // setModal(false);
  }

  return (
    <Box
      pl={4}
      sx={{
        p: 0,
        border: 'solid 1px',
        borderColor: 'gray.3',
        maxWidth: '40ch',
      }}>
      <Flex
        sx={{
          py: 2,
          px: 3,
          alignItems: 'flex-start',
          borderBottom: 'solid 1px #ddd',
        }}>
        <Text as="h4" mb={0} pt={1}>
          Fields
        </Text>
        <Button variant="btnSmall" sx={{ ml: 'auto' }} onClick={toggleModal}>
          Edit
        </Button>
      </Flex>
      <Box
        sx={{
          bg: 'gray.0',
          py: 2,
          px: 3,
          pt: 3,
          pb: 3,
          alignItems: 'flex-start',
        }}>
        {props.fields.map((f: any) => (
          <Flex
            key={f?.id}
            sx={{ py: 2, p: 2, border: 'solid 1px', borderColor: 'gray.3' }}>
            <Text as="h4">{(f && f.value.name) || ''}</Text>
            <Text
              variant="caps"
              pt={1}
              pb={1}
              sx={{ opacity: '0.5', ml: 'auto' }}>
              {(f && f.value.field_type.name) || 'X'}
            </Text>
          </Flex>
        ))}
      </Box>

      <Modal isOpen={showModal} onClose={closeModal}>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              py: 3,
              px: 4,
              borderBottom: 'solid 1px',
              borderColor: 'gray.3',
            }}>
            <Text as="h4" sx={{ fontSize: 1 }}>
              Edit Fields
            </Text>
          </Box>

          {props.fields?.length < 1 && (
            <Box
              sx={{
                bg: 'gray.1',
                pt: 4,
                pb: 4,
                px: 4,
                alignItems: 'flex-start',
              }}>
              <Text as="h3" sx={{ mb: 0 }}>
                Empty State
              </Text>
              <Text as="p" sx={{ fontSize: 1, color: 'gray.6', mb: 3, pr: 3 }}>
                You have no fields added, start adding fields to `field` up your
                Variant
              </Text>
              <Button
                type="button"
                variant="btnPrimary"
                onClick={props.addField}>
                Add Field
              </Button>
            </Box>
          )}
          <Box
            sx={{
              borderTop: 'solid 1px',
              borderColor: 'gray.3',
            }}>
            {props.fields.map((f: any, idx: number) => (
              <Box
                key={idx}
                sx={{
                  borderBottom: 'solid 1px #ddd',
                  '&:hover': { bg: 'gray.1' },
                  py: 3,
                  px: 4,
                }}>
                <Flex p={0} pl={0}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Label htmlFor="`fields[${idx}][name]`" variant="text.caps">
                      Field Name
                    </Label>
                    <Input
                      type="text"
                      // ref={register}
                      defaultValue={(f && f.value.name) || ''}
                      // name={`fields[${idx}][name]`}
                      {...register(`fields[${idx}][name]`)}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, px: 3 }}>
                    <Label
                      htmlFor="`fields[${idx}][type]`"
                      variant="text.caps"
                      mb={1}>
                      Type
                    </Label>
                    <Select
                      // name={`fields[${idx}][type]`}
                      // ref={register}
                      {...register(`fields[${idx}][type]`)}
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
                  <Box pt={0} pl={4} sx={{ textAlign: 'right' }}>
                    <Label variant="text.caps">Action</Label>
                    <Button
                      variant="btnSecondary"
                      type="button"
                      sx={{ py: 1, px: 2, mt: 2 }}
                      onClick={() => props.removeField(idx)}>
                      <Trash color="red" width={24} height={24} />
                    </Button>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>

          {props.fields?.length > 0 && (
            <Box
              sx={{
                bg: 'gray.1',
                pt: 4,
                pb: 4,
                px: 4,
                alignItems: 'flex-start',
              }}>
              <Button
                variant="btnPrimary"
                type="button"
                onClick={props.addField}>
                Add Field
              </Button>
            </Box>
          )}

          {props.fields?.length > 0 && (
            <Flex sx={{ py: 3, px: 4, mb: 0 }}>
              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="btnSecondary"
                  sx={{ mr: 2 }}
                  type="button"
                  onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="btnPrimaryLarge" sx={{ ml: 1 }} type="submit">
                  Save
                </Button>
              </Box>
            </Flex>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default FieldForm;
