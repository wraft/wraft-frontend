import React from 'react';

import { useForm } from 'react-hook-form';
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

    postAPI('field_types', item);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Box>
        <Text mb={3}>Create Field Types</Text>
      </Box>
      <Box mx={0} mb={3}>
        <Flex>
          <Box>
            <Field
              name="name"
              label="Name"
              defaultValue="name"
              register={register}
            />
            <Field
              name="description"
              label="Description"
              defaultValue="desc"
              register={register}
            />
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button ml={2}>Create</Button>
    </Box>
  );
};
export default FieldTypeForm;
