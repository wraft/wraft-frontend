import React from 'react';
import { Box, Flex, Button, Text } from 'rebass';
import { useForm } from 'react-hook-form';

import Field from './Field';
import { createEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

const FieldTypeForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const token = useStoreState(state => state.auth.token);

  const onSubmit = (data: any) => {
    createEntity(data, 'field_types', token)
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} width={1} mt={4}>
      <Box>
        <Text mb={3} fontSize={2} fontWeight={500}>
          Create Field Types
        </Text>
      </Box>
      <Box mx={0} mb={3} width={1}>
        <Flex>
          <Box width={7 / 12}>
            <Field
              name="name"
              label="Name"
              defaultValue="Sample Name"
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
