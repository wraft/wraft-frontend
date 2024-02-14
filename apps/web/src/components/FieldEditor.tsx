import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Box, Flex, Text, Spinner } from 'theme-ui';
import { Label, Input, Select } from 'theme-ui';

import { Trash } from './Icons';
import Modal from './Modal';

interface FieldFormProps {
  fields?: any;
  content?: any;
  fieldtypes?: any;
  addField?: any;
  removeField?: any;
  onSave?: any;
  onClose?: any;
}

type FieldValues = {
  fields: {
    name: string;
    type: string;
  }[];
};

const FieldForm = (props: FieldFormProps) => {
  const fieldsArr = useMemo(() => props.fields || [], [props.fields]);

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'fields',
    control,
  });

  useEffect(() => {
    props.content?.content_type?.fields?.forEach((field: any, index: any) => {
      setValue(`fields.${index}.name`, field.name);
      setValue(`fields.${index}.type`, field.field_type.id);
    });
  }, [props.content, setValue]);

  const [showModal, setModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = (data: FieldValues) => {
    setSubmitting(true);
    const vals = getValues();

    const filteredVals = vals.fields.filter(
      (val: any) => val.name !== undefined || null || '',
    );

    const results = {
      count: fieldsArr.size,
      values: filteredVals,
      data: data,
    };

    props.onSave(results);
    setModal(false);
    setSubmitting(false);
  };

  function toggleModal() {
    setModal((prev) => !prev);
  }

  function closeModal() {
    setModal(false);
  }

  return (
    <Box
      pl={4}
      sx={{
        p: 0,
        maxWidth: '40ch',
      }}>
      <Flex
        sx={{
          py: 2,
          px: 3,
          alignItems: 'flex-start',
          borderBottom: 'solid 1px',
          borderColor: 'border',
        }}>
        <Text as="h4" mb={0} pt={1}>
          Fields
        </Text>
        <Button
          variant="btnSmall"
          sx={{ ml: 'auto', px: 4, bg: 'gray.300' }}
          onClick={() => {
            toggleModal();
            append({ name: '', type: '' });
            remove(-1);
          }}>
          {fieldsArr.length > 0 ? 'Edit' : 'Add'}
        </Button>
      </Flex>
      <Box
        sx={{
          py: 2,
          px: 3,
          pt: 3,
          pb: 3,
          alignItems: 'flex-start',
        }}>
        {fieldsArr &&
          fieldsArr.map((f: any) => (
            <Flex
              key={f?.id}
              sx={{ py: 2, p: 2, border: 'solid 1px', borderColor: 'border' }}>
              <Text as="h4">{(f && f.value && f.value.name) || ''}</Text>
              <Text
                variant="caps"
                pt={1}
                pb={1}
                sx={{ opacity: '0.5', ml: 'auto' }}>
                {(f &&
                  f.value &&
                  f.value.field_type &&
                  f.value.field_type.name) ||
                  'X'}
              </Text>
            </Flex>
          ))}
      </Box>

      <Modal isOpen={showModal} onClose={closeModal}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ bg: 'neutral.100' }}>
          <Box
            sx={{
              py: 3,
              px: 4,
              borderBottom: 'solid 1px',
              borderColor: 'border',
            }}>
            <Text as="p" sx={{ fontSize: 2 }}>
              Manage Fields
            </Text>
          </Box>

          {fields.length < 1 && fieldsArr.length < 1 && (
            <Box
              sx={{
                bg: 'neutral.200',
                pt: 4,
                pb: 4,
                px: 4,
                alignItems: 'flex-start',
              }}>
              <Text as="h3" sx={{ mb: 0 }}>
                Empty State
              </Text>
              <Text as="p" sx={{ fontSize: 1, color: 'text', mb: 3, pr: 3 }}>
                You have no fields added, start adding fields to `field` up your
                Variant
              </Text>
              <Button
                type="button"
                variant="btnPrimary"
                onClick={(e) => {
                  e.preventDefault();
                  append({ name: '', type: '' });
                }}>
                Add Field
              </Button>
            </Box>
          )}
          <Box
            sx={{
              borderTop: 'solid 1px',
              borderColor: 'border',
            }}>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  borderBottom: 'solid 1px',
                  borderColor: 'border',
                  '&:hover': { bg: 'gray.200' },
                  py: 3,
                  px: 4,
                }}>
                <Flex p={0} pl={0}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Label htmlFor="`fields[${idx}][name]`" variant="text.caps">
                      Field Name
                    </Label>
                    <Input
                      disabled={
                        props.content &&
                        field &&
                        !props.content?.content_type.fields.every(
                          (f: any) => f.name !== field.name,
                        )
                      }
                      defaultValue={(field && field.name) || ''}
                      type="text"
                      {...register(`fields.${index}.name` as const, {
                        required: true,
                      })}
                    />
                    {errors.fields && errors.fields?.[index]?.name && (
                      <Text variant="error">
                        {errors.fields?.[index]?.name?.message}
                      </Text>
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1, px: 3 }}>
                    <Label
                      htmlFor="`fields[${idx}][type]`"
                      variant="text.caps"
                      mb={1}>
                      Type
                    </Label>
                    <Select
                      disabled={
                        props.content &&
                        field &&
                        !props.content?.content_type.fields.every(
                          (f: any) => f.name !== field.name,
                        )
                      }
                      defaultValue={(field && field.type) || ''}
                      {...register(`fields.${index}.type` as const, {
                        required: true,
                      })}>
                      <option disabled selected value={''}>
                        select an option
                      </option>
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
                      onClick={() => {
                        props.removeField(index);
                        remove(index);
                      }}>
                      <Trash color="red" width={24} height={24} />
                    </Button>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>
          {(fields?.length > 0 || fieldsArr.length > 0) && (
            <Box
              sx={{
                bg: 'neutral.200',
                pt: 4,
                pb: 4,
                px: 4,
                alignItems: 'flex-start',
              }}>
              <Button
                variant="btnPrimary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  append({ name: '', type: '' });
                }}>
                Add Field
              </Button>
            </Box>
          )}
          {(fields?.length > 0 || fields?.length > 0) && (
            <Flex sx={{ py: 3, px: 4, mb: 0 }}>
              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="btnPrimaryLarge"
                  sx={{ mr: 2 }}
                  type="button"
                  onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="btnPrimaryLarge" sx={{ ml: 1 }} type="submit">
                  {submitting && <Spinner color="white" width={24} />}
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
