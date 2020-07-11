import React from 'react';
import { Box, Flex, Button, Text } from 'rebass';
import { useForm } from 'react-hook-form';

import Field from './Field';
import { createEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

const ThemeForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const token = useStoreState(state => state.auth.token);
  
  const onSubmit = (data: any) => {
    const submitter = {
      name: data.name,
      font: data.font,
      typescale:  { h1: 21, h2: 22},
    }
    createEntity(submitter, 'themes', token)
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} width={1} mt={4}>
      <Box>
        <Text mb={3} fontSize={2} fontWeight={500}>
          Create Theme
        </Text>
      </Box>
      <Box mx={0} mb={3} width={1}>
        <Flex>
          <Box width={7 / 12}>
            <Field
              name="name"
              label="Name"
              defaultValue="New Theme"
              register={register}
            />
            <Field
              name="font"
              label="Font"
              defaultValue="Roboto"
              register={register}
            />
            <Field
              name="typescale"
              label="Typescale"
              defaultValue="1.25"
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
export default ThemeForm;
