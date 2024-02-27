import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Box, Flex, Text, Spinner, useThemeUI } from 'theme-ui';
import { Label, Select } from 'theme-ui';
import { CloseIcon } from '@wraft/icon';

import Field from './Field';
import Modal from './Modal';

interface FieldFormProps {
  fields?: any;
  content?: any;
  fieldtypes?: any;
  addField?: any;
  removeField?: any;
  onSave?: any;
  onClose?: any;
  trigger?: any;
}

type FieldValues = {
  fields: {
    name: string;
    type: string;
  }[];
};

const FieldForm = (props: FieldFormProps) => {
  const fieldsArr = useMemo(() => props.fields || [], [props.fields]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const themeui = useThemeUI();

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

  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = () => {
    setSubmitting(true);
    const vals: FieldValues = getValues();
    console.log('submit on FieldEditor', vals);

    const filteredVals = vals.fields.filter(
      (val: any) => val.name !== undefined || null || '',
    );

    const results = {
      count: fieldsArr.size,
      values: filteredVals,
      data: vals,
    };

    console.log('reslut', results);

    props.onSave(results);
    setSubmitting(false);
    setIsOpen(false);
    props.trigger && props.trigger();
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ minWidth: '60ch', p: 4 }}>
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
          <Box>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  borderBottom:
                    index === fields.length - 1 ? 'none' : '1px solid',
                  borderColor: 'border',
                  pb: index === fields.length - 1 ? 0 : 4,
                  pt: index === 0 ? 0 : 4,
                }}>
                <Flex sx={{ alignItems: 'center' }}>
                  <Field
                    name={`fields.${index}.name`}
                    label="Field Name"
                    register={register}
                    defaultValue={(field && field.name) || ''}
                    // onChange={() => handleSubmit(onSubmit)()}
                    disable={
                      props.content &&
                      field &&
                      !props.content?.content_type.fields.every(
                        (f: any) => f.name !== field.name,
                      )
                    }
                    error={errors.fields?.[index]?.name}
                  />
                  <Box sx={{ flexGrow: 1, ml: 3 }}>
                    <Label htmlFor="`fields[${idx}][type]`">Field Type</Label>
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
                      })}
                      // onChange={() => handleSubmit(onSubmit)()}
                    >
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
                  <Box sx={{ ml: 2, textAlign: 'right' }}>
                    <Button
                      variant="base"
                      type="button"
                      sx={{
                        mt: '28px',
                        p: 2,
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        props.removeField(index);
                        remove(index);
                      }}>
                      <CloseIcon
                        color={themeui?.theme?.colors?.gray?.[600]}
                        width={18}
                        height={18}
                      />
                    </Button>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>
          {(fields?.length > 0 || fieldsArr.length > 0) && (
            <Box
              sx={{
                alignItems: 'flex-start',
              }}>
              <Button
                variant="buttonSecondary"
                type="button"
                mt={4}
                onClick={(e) => {
                  e.preventDefault();
                  append({ name: '', type: '' });
                }}>
                Add Field
              </Button>
            </Box>
          )}
          {(fields?.length > 0 || fields?.length > 0) && (
            <Flex sx={{ justifyContent: 'space-between' }} mt={4}>
              <Box />
              <Button
                variant="btnPrimaryLarge"
                sx={{ ml: 1 }}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }}>
                {submitting && <Spinner color="white" width={24} />}
                Save
              </Button>
            </Flex>
          )}
        </Box>
      </Modal>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
          append({ name: '', type: '' });
          remove(-1);
        }}
        variant="buttonSecondary">
        Edit
      </Button>
      <Box
        sx={{
          mt: 4,
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: '4px',
        }}>
        {fieldsArr &&
          fieldsArr.map((f: any, index: number) => (
            <Flex
              key={f?.id}
              sx={{
                py: 2,
                p: 2,
                borderBottom:
                  index === fieldsArr.length - 1 ? 'none' : '1px solid',
                borderColor: 'border',
              }}>
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
    </Box>
  );
};

export default FieldForm;
