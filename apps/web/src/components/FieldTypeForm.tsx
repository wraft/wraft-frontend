import React from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text } from 'theme-ui';

import { postAPI } from '../utils/models';
import Field from './Field';

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
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Box mx={0} mb={3}>
        <Flex>
          <Box>
            <Field
              name="name"
              label="Name"
              defaultValue="name"
              register={register}
              mb={3}
            />
            <Field
              name="description"
              label="Description"
              defaultValue="desc"
              register={register}
              mb={3}
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
