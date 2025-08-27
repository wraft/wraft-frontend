import React from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Box, Flex, Text } from '@wraft/ui';

import Field from 'common/Field';
import { postAPI } from 'utils/models';

const FieldTypeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const item: any = {
      validations: [
        {
          validation: {
            value: true,
            rule: 'required',
          },
          error_message: "can't be blank",
        },
      ],
      name: data.name,
      meta: {},
      description: data.description,
    };

    const request = postAPI('field_types', item);

    toast.promise(request, {
      loading: 'Loading...',
      success: () => {
        Router.push('/manage/fields');
        return 'Added Field Type Successfully';
      },
      error: () => {
        return 'Failed To Add Field Type';
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p="sm">
      <Box mx={0}>
        <Flex>
          <Box>
            <Field
              name="name"
              label="Name"
              defaultValue="name"
              register={register}
              mb="md"
            />
            <Field
              name="description"
              label="Description"
              defaultValue="desc"
              register={register}
              mb="md"
            />
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button>Create</Button>
    </Box>
  );
};
export default FieldTypeForm;
